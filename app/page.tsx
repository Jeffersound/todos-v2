'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import TodoList from '../components/TodoList'

export default function Home() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (!session) return <Auth />

  return (
    <main className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Tarefas</h1>
      <p className="text-sm mb-4">Usuário logado: {session.user.email}</p>
      
      <TodoList />

      <button
        onClick={async () => await supabase.auth.signOut()}
        className="mt-6 text-sm text-red-500 hover:underline"
      >
        Sair
      </button>
    </main>
  )
}
