import { Building2, GraduationCap, LayoutDashboard, Users, Video } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import favicon from '/favicon.png'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'

const AppSidebar = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { info } = useAuth()
  const { isMobile, setOpenMobile } = useSidebar()

  if (!info || info.role === 'User') return null

  const isSuperAdmin = info.role === 'SuperAdmin'

  const links = [
    { to: '/', label: t('overview.title'), icon: LayoutDashboard, show: isSuperAdmin },
    { to: '/centers', label: t('centers.title'), icon: Building2, show: isSuperAdmin },
    { to: '/users', label: t('users.title'), icon: Users, show: true },
    { to: '/classrooms', label: t('classrooms.title'), icon: GraduationCap, show: true },
    { to: '/streams', label: t('navigation.streams'), icon: Video, show: true },
  ].filter((l) => l.show)

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`))

  return (
    <Sidebar>
      <SidebarHeader className="h-14 flex-row items-center gap-3 border-b border-sidebar-border px-4 py-0">
        <img src={favicon} alt="" className="size-8 rounded-md object-cover" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold">ClassView</p>
          <p className="truncate text-xs text-sidebar-muted">{t(`users.roles.${info.role}`)}</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <nav aria-label="Main navigation">
              <SidebarMenu>
                {links.map(({ to, label, icon: Icon }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild isActive={isActive(to)}>
                      <Link to={to} onClick={() => isMobile && setOpenMobile(false)}>
                        <Icon aria-hidden="true" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <p className="text-xs leading-relaxed text-sidebar-muted">{t('login.copyright')}</p>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
