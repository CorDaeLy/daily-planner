'use client'
import { memo } from 'react'
import { Briefcase, Umbrella, Dumbbell, Coffee } from 'lucide-react'

type Props = {
  onApplyTemplate: (tasks: Array<{
    title: string
    planned_start: string
    planned_end: string
    category: string
  }>) => void
}

const templates = [
  {
    name: '💼 Рабочий день',
    icon: Briefcase,
    color: 'from-blue-500 to-blue-600',
    tasks: [
      { title: 'Утренний план', planned_start: '09:00', planned_end: '09:30', category: 'работа' },
      { title: 'Основная работа', planned_start: '09:30', planned_end: '13:00', category: 'работа' },
      { title: 'Обед', planned_start: '13:00', planned_end: '14:00', category: 'личное' },
      { title: 'Вторая половина', planned_start: '14:00', planned_end: '18:00', category: 'работа' },
      { title: 'Итоги дня', planned_start: '18:00', planned_end: '18:30', category: 'работа' },
    ]
  },
  {
    name: '🏖️ Выходной',
    icon: Umbrella,
    color: 'from-green-500 to-green-600',
    tasks: [
      { title: 'Завтрак', planned_start: '09:00', planned_end: '10:00', category: 'личное' },
      { title: 'Спорт', planned_start: '10:30', planned_end: '12:00', category: 'спорт' },
      { title: 'Прогулка', planned_start: '12:00', planned_end: '13:00', category: 'отдых' },
      { title: 'Обед', planned_start: '13:00', planned_end: '14:00', category: 'личное' },
      { title: 'Хобби', planned_start: '14:00', planned_end: '17:00', category: 'хобби' },
      { title: 'Ужин', planned_start: '19:00', planned_end: '20:00', category: 'личное' },
    ]
  },
  {
    name: '🏃 Спортивный',
    icon: Dumbbell,
    color: 'from-red-500 to-red-600',
    tasks: [
      { title: 'Завтрак', planned_start: '07:00', planned_end: '07:30', category: 'личное' },
      { title: 'Разминка', planned_start: '07:30', planned_end: '08:00', category: 'спорт' },
      { title: 'Тренировка', planned_start: '08:00', planned_end: '09:30', category: 'спорт' },
      { title: 'Растяжка', planned_start: '09:30', planned_end: '10:00', category: 'спорт' },
      { title: 'Восстановление', planned_start: '10:00', planned_end: '11:00', category: 'отдых' },
    ]
  },
  {
    name: '☕ Минимальный',
    icon: Coffee,
    color: 'from-amber-500 to-amber-600',
    tasks: [
      { title: 'Самое важное', planned_start: '09:00', planned_end: '12:00', category: 'работа' },
      { title: 'Перерыв', planned_start: '12:00', planned_end: '13:00', category: 'личное' },
      { title: 'Второе по важности', planned_start: '13:00', planned_end: '16:00', category: 'работа' },
    ]
  }
]

function QuickTemplatesComponent({ onApplyTemplate }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
        <span className="text-lg">⚡</span>
        Быстрые шаблоны
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <button
              key={template.name}
              onClick={() => onApplyTemplate(template.tasks)}
              className={`bg-gradient-to-br ${template.color} text-white p-3 rounded-lg font-medium text-sm transition transform hover:scale-105 active:scale-95 shadow-sm text-left`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" />
                <span className="font-semibold">{template.name}</span>
              </div>
              <div className="text-xs opacity-90">
                {template.tasks.length} задач
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(QuickTemplatesComponent)