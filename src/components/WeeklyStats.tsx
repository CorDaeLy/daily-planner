'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { TrendingUp, Flame } from 'lucide-react'
import { memo } from 'react'

type WeekDay = {
  day_name: string
  date_value: string
  total_tasks: number
  done_tasks: number
  partial_tasks: number
  skipped_tasks: number
  completion_rate: number
}

function WeeklyStatsComponent() {
  const [weekData, setWeekData] = useState<WeekDay[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    const { data: weekData, error: weekError } = await supabase
      .rpc('get_weekly_stats', { user_id_param: 'me' })
    
    if (weekError) {
      console.error('Ошибка загрузки недельной статистики:', weekError)
    }
    
    if (weekData) {
      console.log('📊 Данные за неделю:', weekData)
      setWeekData(weekData)
    }

    const { data: streakData, error: streakError } = await supabase
      .rpc('get_current_streak', { user_id_param: 'me' })
    
    if (streakError) {
      console.error('Ошибка загрузки streak:', streakError)
    }
    
    if (streakData) {
      console.log('🔥 Streak:', streakData)
      setStreak(streakData)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const fullWeekData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().slice(0, 10)
    const found = weekData.find(d => d.date_value === dateStr)
    
    if (found) {
      fullWeekData.push({
        day: weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
        task_date: dateStr,
        total_tasks: found.total_tasks || 0,
        done_tasks: found.done_tasks || 0,
        completion_rate: found.completion_rate || 0
      })
    } else {
      fullWeekData.push({
        day: weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
        task_date: dateStr,
        total_tasks: 0,
        done_tasks: 0,
        completion_rate: 0
      })
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Статистика за неделю
          </h3>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {streak} дн.
            </span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={fullWeekData}>
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as any
                return (
                  <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm">
                    <p className="font-medium">{data.day}</p>
                    <p>{data.completion_rate}% выполнено</p>
                    <p className="text-gray-400 text-xs">{data.done_tasks}/{data.total_tasks} задач</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar 
            dataKey="completion_rate" 
            radius={[6, 6, 0, 0]}
          >
            {fullWeekData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.completion_rate >= 100 ? '#22c55e' : 
                      entry.completion_rate >= 50 ? '#3b82f6' : 
                      entry.completion_rate > 0 ? '#eab308' : '#d1d5db'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {fullWeekData.reduce((sum, d) => sum + d.done_tasks, 0)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Выполнено
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(fullWeekData.reduce((sum, d) => sum + d.completion_rate, 0) / 7)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Среднее
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5" />
            {streak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Серия дней
          </div>
        </div>
      </div>

      {streak >= 3 && (
        <div className="mt-3 p-3 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-sm text-orange-800 dark:text-orange-300 font-medium">
            🔥 Отличная работа! Серия {streak} дней подряд!
          </span>
        </div>
      )}
    </div>
  )
}

export default memo(WeeklyStatsComponent)