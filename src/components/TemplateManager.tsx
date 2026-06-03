'use client'
import { useState, useEffect, memo } from 'react'
import { Settings, Plus, X, Trash2, Save } from 'lucide-react'

type TemplateTask = {
  title: string
  planned_start: string
  planned_end: string
  category: string
}

type Template = {
  id: string
  name: string
  icon: string
  color: string
  tasks: TemplateTask[]
}

type Props = {
  onApplyTemplate: (tasks: TemplateTask[]) => void
}

const defaultTemplates: Template[] = [
  {
    id: 'work',
    name: '💼 Рабочий день',
    icon: '💼',
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
    id: 'weekend',
    name: '🏖️ Выходной',
    icon: '🏖️',
    color: 'from-green-500 to-green-600',
    tasks: [
      { title: 'Завтрак', planned_start: '09:00', planned_end: '10:00', category: 'личное' },
      { title: 'Спорт', planned_start: '10:30', planned_end: '12:00', category: 'спорт' },
      { title: 'Прогулка', planned_start: '12:00', planned_end: '13:00', category: 'отдых' },
      { title: 'Обед', planned_start: '13:00', planned_end: '14:00', category: 'личное' },
      { title: 'Хобби', planned_start: '14:00', planned_end: '17:00', category: 'хобби' },
    ]
  }
]

const categories = [
  { value: 'общее', label: '📌 Общее' },
  { value: 'работа', label: '💼 Работа' },
  { value: 'спорт', label: '🏃 Спорт' },
  { value: 'личное', label: '👤 Личное' },
  { value: 'хобби', label: '🎨 Хобби' },
  { value: 'отдых', label: '☕ Отдых' },
]

const colors = [
  { name: 'Синий', value: 'from-blue-500 to-blue-600' },
  { name: 'Зелёный', value: 'from-green-500 to-green-600' },
  { name: 'Красный', value: 'from-red-500 to-red-600' },
  { name: 'Жёлтый', value: 'from-amber-500 to-amber-600' },
  { name: 'Фиолетовый', value: 'from-purple-500 to-purple-600' },
  { name: 'Розовый', value: 'from-pink-500 to-pink-600' },
]

const emojis = ['💼', '️', '🏃', '☕', '', '📚', '🎮', '🎵', '🌟', '🔥', '💪', '🧘']

function TemplateManagerComponent({ onApplyTemplate }: Props) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('customTemplates')
    if (saved) {
      setTemplates(JSON.parse(saved))
    } else {
      setTemplates(defaultTemplates)
    }
  }, [])

  const saveTemplates = (newTemplates: Template[]) => {
    setTemplates(newTemplates)
    localStorage.setItem('customTemplates', JSON.stringify(newTemplates))
  }

  const handleAddTemplate = () => {
    setEditingTemplate({
      id: Date.now().toString(),
      name: 'Новый шаблон',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600',
      tasks: []
    })
    setIsEditing(true)
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate({ ...template })
    setIsEditing(true)
  }

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Удалить этот шаблон?')) {
      const newTemplates = templates.filter(t => t.id !== id)
      saveTemplates(newTemplates)
    }
  }

  const handleSaveTemplate = () => {
    if (!editingTemplate) return
    
    const existingIndex = templates.findIndex(t => t.id === editingTemplate.id)
    let newTemplates: Template[]
    
    if (existingIndex >= 0) {
      newTemplates = [...templates]
      newTemplates[existingIndex] = editingTemplate
    } else {
      newTemplates = [...templates, editingTemplate]
    }
    
    saveTemplates(newTemplates)
    setIsEditing(false)
    setEditingTemplate(null)
  }

  const addTaskToTemplate = () => {
    if (!editingTemplate) return
    setEditingTemplate({
      ...editingTemplate,
      tasks: [
        ...editingTemplate.tasks,
        { title: '', planned_start: '09:00', planned_end: '10:00', category: 'общее' }
      ]
    })
  }

  const updateTaskInTemplate = (index: number, field: keyof TemplateTask, value: string) => {
    if (!editingTemplate) return
    const newTasks = [...editingTemplate.tasks]
    newTasks[index] = { ...newTasks[index], [field]: value }
    setEditingTemplate({ ...editingTemplate, tasks: newTasks })
  }

  const removeTaskFromTemplate = (index: number) => {
    if (!editingTemplate) return
    const newTasks = editingTemplate.tasks.filter((_, i) => i !== index)
    setEditingTemplate({ ...editingTemplate, tasks: newTasks })
  }

  if (isEditing && editingTemplate) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {templates.find(t => t.id === editingTemplate.id) ? 'Редактировать шаблон' : 'Новый шаблон'}
            </h2>
            <button
              onClick={() => { setIsEditing(false); setEditingTemplate(null) }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Название шаблона
              </label>
              <input
                type="text"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Иконка
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditingTemplate({ ...editingTemplate, icon: emoji })}
                      className={`p-2 text-xl rounded-lg transition ${
                        editingTemplate.icon === emoji
                          ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Цвет
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setEditingTemplate({ ...editingTemplate, color: color.value })}
                      className={`bg-gradient-to-br ${color.value} text-white px-3 py-2 rounded-lg text-xs font-medium transition ${
                        editingTemplate.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Задачи в шаблоне
                </label>
                <button
                  type="button"
                  onClick={addTaskToTemplate}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Добавить
                </button>
              </div>

              <div className="space-y-3">
                {editingTemplate.tasks.map((task, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Задача {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTaskFromTemplate(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Название задачи"
                      value={task.title}
                      onChange={(e) => updateTaskInTemplate(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="time"
                        value={task.planned_start}
                        onChange={(e) => updateTaskInTemplate(index, 'planned_start', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <input
                        type="time"
                        value={task.planned_end}
                        onChange={(e) => updateTaskInTemplate(index, 'planned_end', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                      <select
                        value={task.category}
                        onChange={(e) => updateTaskInTemplate(index, 'category', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setEditingTemplate(null) }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSaveTemplate}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Сохранить
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <span className="text-lg">⚡</span>
            Быстрые шаблоны
          </h3>
          <button
            onClick={() => setIsManagerOpen(!isManagerOpen)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
            title="Настроить шаблоны"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        {!isManagerOpen ? (
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onApplyTemplate(template.tasks)}
                className={`bg-gradient-to-br ${template.color} text-white p-3 rounded-lg font-medium text-sm transition transform hover:scale-105 active:scale-95 shadow-sm text-left`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{template.icon}</span>
                  <span className="font-semibold">{template.name}</span>
                </div>
                <div className="text-xs opacity-90">
                  {template.tasks.length} задач
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center text-xl`}>
                    {template.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{template.name}</div>
                    <div className="text-sm text-gray-500">{template.tasks.length} задач</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddTemplate}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Создать шаблон
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default memo(TemplateManagerComponent)