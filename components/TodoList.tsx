'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Todo {
  id: string
  task: string
  is_complete: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setTodos(data)
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return

    const user = (await supabase.auth.getUser()).data.user
    const { error } = await supabase.from('todos').insert({
      task: newTodo,
      user_id: user?.id,
    })

    if (error) console.error(error)
    else {
      setNewTodo('')
      fetchTodos()
    }
  }

  const toggleTodo = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !currentState })
      .eq('id', id)

    if (error) console.error(error)
    else fetchTodos()
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (error) console.error(error)
    else fetchTodos()
  }

  return (
    <div className="mt-6">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1 border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
          placeholder="Nova tarefa"
        />
        <button
          onClick={addTodo}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Adicionar
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border px-3 py-2 rounded"
          >
            <span
              onClick={() => toggleTodo(todo.id, todo.is_complete)}
              className={`cursor-pointer flex-1 ${
                todo.is_complete ? 'line-through text-gray-400' : ''
              }`}
            >
              {todo.task}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 text-sm ml-4 hover:underline"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
