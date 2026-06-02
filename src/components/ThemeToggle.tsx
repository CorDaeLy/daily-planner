'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-10 h-10" />

  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-lg transition ${
          theme === 'light' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`}
        title="Светлая тема"
      >
        <Sun className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-lg transition ${
          theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'text-gray-500 hover:text-gray-300'
        }`}
        title="Тёмная тема"
      >
        <Moon className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-lg transition ${
          theme === 'system' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-500'
        }`}
        title="Системная"
      >
        <Monitor className="w-5 h-5" />
      </button>
    </div>
  )
}