'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, CalendarDays } from 'lucide-react'

export default function WeeklyStats() {
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    loadWeeklyStats()
  }, [])

  async function loadWeeklyStats() {
    const { data, error } = await supabase
      .rpc('get_weekly_stats', { user_id_param: 'me' })
    
    if (data) {
      setWeeklyData(data)
      // Простой расчёт streak
      const consecutiveDays = data.filter((d: any) => d.completion_rate > 50).length
      setStreak(consecutiveDays)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          Статистика за неделю
        </h3>
      </div>
      
      {weeklyData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip />
              <Bar dataKey="completion_rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          {streak > 0 && (
            <div className="flex items-center gap-2 mt-3 text-orange-500">
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm font-medium">
                🔥 {streak} дней подряд с выполнением {'>'} 50% 
              </span>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-sm text-center py-4">
          Нет данных за неделю
        </p>
      )}
    </div>
  )
}
