import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export interface Language {
  code: string
  label: string
  flag: string
}

interface LanguageSelectProps {
  languages: Language[]
  selectedLang: Language
  setSelectedLang: (lang: Language) => void
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ languages, selectedLang, setSelectedLang }) => {
  const [langDropdown, setLangDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { t, i18n } = useTranslation()

  useEffect(() => {
    i18n.changeLanguage(selectedLang.code)
  }, [selectedLang, i18n])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setLangDropdown(!langDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        <img
          src={selectedLang.flag}
          alt={selectedLang.label}
          className="w-5 h-5 rounded-sm object-cover"
        />
        <span>{selectedLang.label}</span>
        <svg
          className={`w-3 h-3 ml-1 transition-transform ${langDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {langDropdown && (
        <ul className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => {
                setSelectedLang(lang)
                setLangDropdown(false)
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <img
                src={lang.flag}
                alt={lang.label}
                className="w-5 h-5 rounded-sm object-cover"
              />
              <span>{lang.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSelect
