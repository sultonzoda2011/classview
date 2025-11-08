import Cookies from 'js-cookie'
import { LogOut, User, X } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import LanguageSelect from '../languageSelect'

interface IMenuUserModalProps {
  menuUserModalOpen: boolean
  setMenuUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MenuUserModal({
  menuUserModalOpen,
  setMenuUserModalOpen,
}: IMenuUserModalProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

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
  const [selectedLang, setSelectedLang] = useState(languages[0])

  if (!menuUserModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 animate-fadeIn">
      <div
        className="absolute inset-0 transition-opacity duration-300 bg-black/20"
        onClick={() => setMenuUserModalOpen(false)}
      />

      <div
        className="relative mt-14 mr-2 sm:mr-6 w-64 sm:w-72 max-w-full rounded-2xl shadow-2xl border border-gray-200/60
                   bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-800 dark:text-gray-100 transition-all duration-300 animate-scaleIn mx-2"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/60 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500 text-white shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t('menuUser.title')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('menuUser.viewEdit')}</p>
            </div>
          </div>

          <button
            onClick={() => setMenuUserModalOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label={t('common.back')}
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-200/60 dark:border-gray-700">
           <LanguageSelect
            languages={languages}
            selectedLang={selectedLang}
            setSelectedLang={setSelectedLang}
          />
        </div>

        <div className="px-3 py-3 space-y-2">
          <button
            onClick={() => {
              navigate('/profile')
              setMenuUserModalOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all
                       hover:bg-indigo-50 hover:shadow-sm group"
          >
            <User className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition" />
            <span className="text-sm font-medium">{t('common.profile')}</span>
          </button>

          <button
            onClick={() => {
              Cookies.remove('token')
              navigate('/')
              setMenuUserModalOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all
                       hover:bg-rose-50 hover:shadow-sm group"
          >
            <LogOut className="w-4 h-4 text-rose-500 group-hover:scale-110 transition" />
            <span className="text-sm font-medium">{t('auth.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
