'use client'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, MinusCircle, XCircle, Clock, Trash2 } from 'lucide-react'

type Task = {
  id: string
  title: string
  task_date: string
  planned_start?: string | null
  planned_end?: string | null
  status: 'pending' | 'partial' | 'done' | 'skipped'
}

type Props = { 
  task: Task
  onStatus: (id: string, status: string) => void
  onDelete?: (id: string) => void
}

export default function TaskItem({ task, onStatus, onDelete }: Props) {
  const statusConfig = {
    pending: { 
      icon: Circle, 
      color: 'text-gray-400', 
      bg: 'bg-gray-50 dark:bg-gray-800',
      border: 'border-l-4 border-gray-400'
    },
    partial: { 
      icon: MinusCircle, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-50 dark:bg-gray-800',
      border: 'border-l-4 border-yellow-400'
    },
    done: { 
      icon: CheckCircle2, 
      color: 'text-green-500', 
      bg: 'bg-green-50 dark:bg-gray-800',
      border: 'border-l-4 border-green-400'
    },
    skipped: { 
      icon: XCircle, 
      color: 'text-red-500', 
      bg: 'bg-red-50 dark:bg-gray-800',
      border: 'border-l-4 border-red-400'
    }
  }

  const config = statusConfig[task.status]
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl shadow-sm ${config.bg} ${config.border} transition-all group`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h3 className={`font-medium text-gray-900 dark:text-gray-100 ${
            task.status === 'skipped' ? 'line-through opacity-60' : ''
          }`}>
            {task.title}
          </h3>
          {task.planned_start && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 rounded-lg px-2 py-1 inline-flex">
                <Clock className="w-3 h-3" />
                <span>{task.planned_start}</span>
                {task.planned_end && (
                <>
                    <span>→</span>
                    <span>{task.planned_end}</span>
                </>
                )}
            </div>
            )}
        </div>
        
        <div className="flex gap-2">
          <select
            value={task.status}
            onChange={(e) => onStatus(task.id, e.target.value)}
            className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            <option value="pending">⏳ В планах</option>
            <option value="partial">🔸 Частично</option>
            <option value="done">✅ Готово</option>
            <option value="skipped">⏭️ Пропущено</option>
          </select>
          
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Удалить задачу"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}