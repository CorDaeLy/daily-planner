'use client'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { CheckCircle2, Circle, MinusCircle, XCircle, Clock, Trash2 } from 'lucide-react'
import { memo, useRef } from 'react'

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

function TaskItemComponent({ task, onStatus, onDelete }: Props) {
  const isDeleting = useRef(false)
  const x = useMotionValue(0)
  
  const bgLeft = useTransform(x, [-200, 0], ['rgba(239, 68, 68, 0.9)', 'rgba(239, 68, 68, 0)'])
  const bgRight = useTransform(x, [0, 200], ['rgba(34, 197, 94, 0)', 'rgba(34, 197, 94, 0.9)'])
  
  const iconLeft = useTransform(x, [-200, -100, 0], [1, 0.5, 0])
  const iconRight = useTransform(x, [0, 100, 200], [0, 0.5, 1])

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

  const handleDragEnd = () => {
    const currentX = x.get()
    
    if (currentX > 100) {
      onStatus(task.id, 'done')
      animate(x, 0, { duration: 0.3 })
    } else if (currentX < -100) {
      onStatus(task.id, 'skipped')
      animate(x, 0, { duration: 0.3 })
    } else {
      animate(x, 0, { duration: 0.3 })
    }
  }

  const handleDelete = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Блокировка повторных вызовов
    if (isDeleting.current) return
    isDeleting.current = true
    
    try {
      if (onDelete) {
        if (confirm('Удалить эту задачу?')) {
          onDelete(task.id)
        }
      }
    } finally {
      setTimeout(() => { isDeleting.current = false }, 500)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`relative rounded-xl shadow-sm overflow-hidden ${config.bg} ${config.border}`}
    >
      {/* Фон при свайпе влево (красный - пропустить) */}
      <motion.div 
        style={{ backgroundColor: bgLeft }}
        className="absolute inset-0 flex items-center justify-start px-6 pointer-events-none"
      >
        <motion.div style={{ opacity: iconLeft }} className="flex items-center gap-2 text-white font-medium">
          <XCircle className="w-6 h-6" />
          <span className="hidden sm:inline">Пропустить</span>
        </motion.div>
      </motion.div>

      {/* Фон при свайпе вправо (зелёный - готово) */}
      <motion.div 
        style={{ backgroundColor: bgRight }}
        className="absolute inset-0 flex items-center justify-end px-6 pointer-events-none"
      >
        <motion.div style={{ opacity: iconRight }} className="flex items-center gap-2 text-white font-medium">
          <span className="hidden sm:inline">Готово</span>
          <CheckCircle2 className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Основной контент */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        onDragEnd={handleDragEnd}
        className="relative p-4 cursor-grab active:cursor-grabbing touch-manipulation"
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
                    <span className="mx-1">→</span>
                    <span>{task.planned_end}</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 items-center">
            <select
              value={task.status}
              onChange={(e) => {
                e.stopPropagation()
                onStatus(task.id, e.target.value)
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="pending">⏳ В планах</option>
              <option value="partial"> Частично</option>
              <option value="done">✅ Готово</option>
              <option value="skipped">⏭️ Пропущено</option>
            </select>
            
            {onDelete && (
              <button
                onPointerDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleDelete(e)
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleDelete(e)
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Удалить задачу"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default memo(TaskItemComponent)