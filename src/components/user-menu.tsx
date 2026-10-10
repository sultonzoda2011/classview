import { LogOut, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Avatar } from './avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'

/** Меню пользователя в хедере — профиль и выход. Заменяет собой menuUserModal.tsx. */
const UserMenu = () => {
  const { t } = useTranslation()
  const { info, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label={t('menuUser.title')}>
          <Avatar name={info?.unique_name} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="truncate">{info?.unique_name}</p>
          <p className="text-xs font-normal text-gray-400">{t(`users.roles.${info?.role ?? 'User'}`)}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="h-4 w-4" />
          {t('common.profile')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/30"
        >
          <LogOut className="h-4 w-4" />
          {t('auth.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
