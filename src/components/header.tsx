import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import type { CustomJwtPayload } from '../types/jwt'
import MenuUserModal from './modal/menuUserModal'
import LanguageSelect from './languageSelect'

const Header: React.FC = () => {
  const token = Cookies.get('token')
  let info: CustomJwtPayload | null = null
  const { t, i18n } = useTranslation()

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [menuUserModalOpen, setMenuUserModalOpen] = useState(false)

  const languages = [
    {
      code: 'en',
      label: t('header.language.english'),
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1024px-Flag_of_the_United_Kingdom_%283-5%29.svg.png',
    },
    {
      code: 'tj',
      label: t('header.language.tajik'),
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/2560px-Flag_of_Tajikistan.svg.png',
    },
    {
      code: 'ru',
      label: t('header.language.russian'),
      flag: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJYo9xokjFiNZypS-HrcUiYsLuh-rPb3zKsQ&s',
    },
  ]
  const [selectedLang, setSelectedLang] = useState(() => {
    const savedLang = languages.find((lang) => lang.code === i18n.language)
    return savedLang || languages[0]
  })

  useEffect(() => {
    i18n.changeLanguage(selectedLang.code)
  }, [selectedLang, i18n])

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (token) {
      info = jwtDecode<CustomJwtPayload>(token)
  }

  const location = useLocation()

  const formatPathname = (pathname: string) => {
    if (!pathname || pathname === '/') return t('overview.title')
    return pathname
      .slice(1)
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <>
      <header className="w-full backdrop-blur-md bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex flex-row items-center justify-between shadow-md border-b border-white/20 dark:border-gray-700 sticky top-0 z-50 transition-all duration-500">
        <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight drop-shadow-md">
          {t('navigation.welcome')} {formatPathname(location.pathname)}
        </h1>

        <div className="flex items-center gap-3 sm:gap-4 relative">
          <LanguageSelect
            languages={languages}
            selectedLang={selectedLang}
            setSelectedLang={setSelectedLang}
          />

          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-white font-bold shadow-md hover:scale-105 transition-transform duration-300"
            aria-label={isDarkMode ? t('header.themes.dark') : t('header.themes.light')}
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} className="rotate-180" />}
          </button>

          <div
            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 dark:bg-gray-600 flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer select-none"
            onClick={() => setMenuUserModalOpen(true)}
          >
            {info?.unique_name && info.unique_name.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <MenuUserModal
        menuUserModalOpen={menuUserModalOpen}
        setMenuUserModalOpen={setMenuUserModalOpen}
      />
    </>
  )
}

export default Header
