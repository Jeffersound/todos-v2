'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl mb-4 text-center">{isLogin ? 'Entrar' : 'Registrar'}</h1>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Registrar'}
        </button>
        <button
          type="button"
          className="w-full text-sm text-gray-500 mt-2 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Criar conta' : 'Já tenho conta'}
        </button>
      </form>
    </div>
  )
}
