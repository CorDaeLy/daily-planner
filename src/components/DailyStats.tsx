'use client'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CheckCircle2, Clock, XCircle, MinusCircle } from 'lucide-react'

type Task = {
  status: 'pending' | 'partial' | 'done' | 'skipped'
}

type Props = {
  tasks: Task[]
}

export default function DailyStats({ tasks }: Props) {
  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    partial: tasks.filter(t => t.status === 'partial').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    skipped: tasks.filter(t => t.status === 'skipped').length
  }

  const completionRate = stats.total > 0 
    ? Math.round((stats.done / stats.total) * 100) 
    : 0

  const data = [
    { name: 'Выполнено', value: stats.done, color: '#22c55e' },
    { name: 'Частично', value: stats.partial, color: '#eab308' },
    { name: 'В планах', value: stats.pending, color: '#9ca3af' },
    { name: 'Пропущено', value: stats.skipped, color: '#ef4444' }
  ].filter(item => item.value > 0)

  return (
    <div className="mb-6 space-y-4">
      {/* Прогресс бар */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Выполнение
          </span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {completionRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {stats.done} из {stats.total} задач выполнено
        </p>
      </div>

      {/* Круговая диаграмма */}
      {stats.total > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Распределение задач
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Легенда */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {stats.done} выполнено
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {stats.pending} в планах
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MinusCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {stats.partial} частично
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {stats.skipped} пропущено
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}