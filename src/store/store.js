import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

// Simple context-based state management to avoid extra dependencies
// Persists user session and cart to localStorage

const initialState = {
  user: null, // { id, name, email, role: 'customer' | 'admin' }
  cart: {
    items: [], // { id, name, price, image, qty }
  },
  ui: {
    cartOpen: false,
    authOpen: false,
    checkoutOpen: false,
  },
}

function subtotal(items) {
  return items.reduce((acc, it) => acc + it.price * it.qty, 0)
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload }
    case 'OPEN_CART':
      return { ...state, ui: { ...state.ui, cartOpen: true } }
    case 'CLOSE_CART':
      return { ...state, ui: { ...state.ui, cartOpen: false } }
    case 'OPEN_AUTH':
      return { ...state, ui: { ...state.ui, authOpen: true } }
    case 'CLOSE_AUTH':
      return { ...state, ui: { ...state.ui, authOpen: false } }
    case 'OPEN_CHECKOUT':
      return { ...state, ui: { ...state.ui, checkoutOpen: true } }
    case 'CLOSE_CHECKOUT':
      return { ...state, ui: { ...state.ui, checkoutOpen: false } }
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    case 'ADD_TO_CART': {
      const exists = state.cart.items.find((i) => i.id === action.payload.id)
      let items
      if (exists) {
        items = state.cart.items.map((i) =>
          i.id === action.payload.id ? { ...i, qty: Math.min(i.qty + (action.payload.qty || 1), 99) } : i
        )
      } else {
        items = [...state.cart.items, { ...action.payload, qty: action.payload.qty || 1 }]
      }
      return { ...state, cart: { items } }
    }
    case 'REMOVE_FROM_CART': {
      const items = state.cart.items.filter((i) => i.id !== action.payload)
      return { ...state, cart: { items } }
    }
    case 'SET_QTY': {
      const { id, qty } = action.payload
      const items = state.cart.items
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i))
        .filter((i) => i.qty > 0)
      return { ...state, cart: { items } }
    }
    case 'CLEAR_CART':
      return { ...state, cart: { items: [] } }
    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cakeshop_state')
      if (raw) {
        const parsed = JSON.parse(raw)
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch {}
  }, [])

  // persist to localStorage
  useEffect(() => {
    const persist = { user: state.user, cart: state.cart }
    try {
      localStorage.setItem('cakeshop_state', JSON.stringify(persist))
    } catch {}
  }, [state.user, state.cart])

  const value = useMemo(() => {
    return {
      state,
      dispatch,
      selectors: {
        cartCount: state.cart.items.reduce((acc, i) => acc + i.qty, 0),
        cartSubtotal: subtotal(state.cart.items),
        isAdmin: state.user?.role === 'admin',
      },
    }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export const pastel = {
  pink: '#F8BBD0',
  purple: '#E1BEE7',
  blue: '#BBDEFB',
}
