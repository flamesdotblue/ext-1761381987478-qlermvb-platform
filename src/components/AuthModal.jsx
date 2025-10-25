import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export default function AuthModal() {
  const { state, dispatch } = useStore()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    if (state.ui.authOpen) {
      setError('')
      closeRef.current?.focus()
    }
  }, [state.ui.authOpen])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && state.ui.authOpen) dispatch({ type: 'CLOSE_AUTH' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.ui.authOpen, dispatch])

  function validate() {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Enter a valid email'
    if (password.length < 6) return 'Password must be at least 6 characters'
    if (mode === 'register' && name.trim().length < 2) return 'Enter your full name'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const v = validate()
    if (v) return setError(v)

    // demo-only client-side password hashing and session storage
    const pwdHash = await sha256(password)

    if (mode === 'login') {
      const raw = localStorage.getItem('cakeshop_users')
      const users = raw ? JSON.parse(raw) : {}
      const record = users[email]
      if (!record || record.password !== pwdHash) {
        setError('Invalid email or password')
        return
      }
      dispatch({ type: 'LOGIN', payload: { id: record.id, name: record.name, email, role: record.role } })
      dispatch({ type: 'CLOSE_AUTH' })
      return
    }

    // register
    const raw = localStorage.getItem('cakeshop_users')
    const users = raw ? JSON.parse(raw) : {}
    if (users[email]) {
      setError('An account with this email already exists')
      return
    }
    const role = email.endsWith('@admin.local') ? 'admin' : 'customer'
    const id = 'u_' + Math.random().toString(36).slice(2, 9)
    users[email] = { id, name, role, password: pwdHash }
    localStorage.setItem('cakeshop_users', JSON.stringify(users))
    dispatch({ type: 'LOGIN', payload: { id, name, email, role } })
    dispatch({ type: 'CLOSE_AUTH' })
  }

  return (
    <div
      id="auth-modal"
      role="dialog"
      aria-modal={state.ui.authOpen}
      aria-labelledby="auth-title"
      className={`fixed inset-0 z-50 ${state.ui.authOpen ? '' : 'pointer-events-none'}`}
    >
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${state.ui.authOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => dispatch({ type: 'CLOSE_AUTH' })} />
      <div ref={dialogRef} className={`absolute inset-0 flex items-center justify-center p-4 transition ${state.ui.authOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 id="auth-title" className="text-lg font-semibold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <button ref={closeRef} onClick={() => dispatch({ type: 'CLOSE_AUTH' })} className="px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400" aria-label="Close sign in dialog">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4" noValidate>
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
                <input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 focus:border-pink-500 focus:ring-pink-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" type="password" name="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 focus:border-pink-500 focus:ring-pink-500" />
            </div>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <button type="submit" className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
          <div className="px-5 pb-5 text-sm text-gray-600">
            {mode === 'login' ? (
              <button onClick={() => setMode('register')} className="underline hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded">New here? Create an account</button>
            ) : (
              <button onClick={() => setMode('login')} className="underline hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded">Already have an account? Sign in</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
