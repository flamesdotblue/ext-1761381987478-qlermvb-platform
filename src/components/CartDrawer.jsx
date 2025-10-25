import { X, Plus, Minus, Trash2, Lock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function CartDrawer({ open, onClose, cart, onUpdateQty, onRemove, subtotal, onCheckout, user, onAuthRequest }) {
  const drawerRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ name: '', email: '', address: '' })

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setErrors({})
  }, [open])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email is required'
    if (!form.address.trim()) e.address = 'Address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = async () => {
    if (!user) {
      onAuthRequest()
      return
    }
    if (!validate()) return
    try {
      await onCheckout(form)
    } catch (err) {
      alert(err.message || 'Payment failed')
    }
  }

  return (
    <div
      className={
        'fixed inset-0 z-50 ' +
        (open ? 'pointer-events-auto' : 'pointer-events-none')
      }
      aria-hidden={!open}
      aria-labelledby="cart-title"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className={
          'absolute inset-0 bg-slate-900/40 transition-opacity ' +
          (open ? 'opacity-100' : 'opacity-0')
        }
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={
          'absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform will-change-transform ' +
          (open ? 'translate-x-0' : 'translate-x-full')
        }
        aria-live="polite"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 id="cart-title" className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-2 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[55%] divide-y" role="list">
          {cart.length === 0 ? (
            <p className="p-4 text-sm text-slate-600">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="p-4 flex gap-3" role="listitem">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-20 rounded object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-600">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-1 rounded hover:bg-slate-50 text-slate-600"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2" aria-label={`Quantity for ${item.name}`}>
                    <button
                      onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-full border hover:bg-slate-50"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => onUpdateQty(item.id, Number(e.target.value) || 1)}
                      className="w-14 rounded border px-2 py-1 text-center"
                      aria-live="polite"
                    />
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-full border hover:bg-slate-50"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary + Checkout */}
        <div className="border-t p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Subtotal</span>
            <span className="text-lg font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
          </div>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              if (!user) {
                onAuthRequest()
                return
              }
              if (validate()) {
                handlePay()
              }
            }}
            noValidate
            aria-labelledby="checkout-title"
          >
            <h3 id="checkout-title" className="font-medium text-slate-900">Checkout</h3>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm" htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={`w-full rounded border px-3 py-2 ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-xs text-red-600">{errors.name}</p>
              )}

              <label className="text-sm" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={`w-full rounded border px-3 py-2 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-600">{errors.email}</p>
              )}

              <label className="text-sm" htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className={`w-full rounded border px-3 py-2 ${errors.address ? 'border-red-500' : 'border-slate-300'}`}
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? 'address-error' : undefined}
              />
              {errors.address && (
                <p id="address-error" className="text-xs text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              {!user && (
                <p className="text-xs text-slate-600">Please log in to continue.</p>
              )}
              <button
                type="button"
                onClick={handlePay}
                disabled={cart.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
                aria-label="Pay now"
              >
                <Lock className="h-4 w-4" />
                Pay securely
              </button>
              <p className="text-[11px] text-slate-500 text-center">Payments are securely processed. For demo purposes, this simulates a successful payment.</p>
            </div>
          </form>
        </div>
      </aside>
    </div>
  )
}
