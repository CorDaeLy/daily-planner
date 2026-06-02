'use client'
import AddTaskModal from '@/components/AddTaskModal'
import ThemeToggle from '@/components/ThemeToggle'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import TaskItem from '@/components/TaskItem'
import DailyStats from '@/components/DailyStats'
import { AnimatePresence } from 'framer-motion'
import { Plus, Calendar } from 'lucide-react'

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([])
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => { loadTasks() }, [date])

  async function loadTasks() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', 'me')
      .eq('task_date', date)
      .order('created_at', { ascending: false })

    if (!error && data) setTasks(data)
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('tasks').update({ 
      status, 
      updated_at: new Date().toISOString() 
    }).eq('id', id)
    loadTasks()
  }

  async function addTask(title: string, start: string | null, end: string | null) {
    const { error } = await supabase.from('tasks').insert({ 
      user_id: 'me', 
      title: title.trim(), 
      task_date: date,
      planned_start: start,
      planned_end: end
    })
    
    if (error) {
      console.error('Ошибка:', error)
      alert('Ошибка при добавлении задачи')
    } else {
      loadTasks()
    }
  }

  async function deleteTask(id: string) {
    if (!confirm('Удалить эту задачу?')) return
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Ошибка при удалении:', error)
      alert('Ошибка при удалении задачи')
    } else {
      loadTasks()
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 pb-24 md:max-w-lg md:mx-auto">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📅 План на день
        </h1>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Организуйте свой день эффективно
        </p>
      </div>

      {/* Статистика */}
      <DailyStats tasks={tasks} />
      
      {/* Выбор даты и добавление */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Добавить</span>
        </button>
      </div>

      {/* Список задач */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <AnimatePresence>
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Нет задач на этот день
              </p>
              <p className="text-sm text-gray-400">
                Добавьте первую задачу ↑
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(t => (
                <TaskItem 
                  key={t.id} 
                  task={t} 
                  onStatus={updateStatus}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      )}

      {/* Модальное окно добавления задачи */}
      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTask}
      />
    </main>
  )
}