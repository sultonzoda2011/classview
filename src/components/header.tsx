import LanguageSelect from './language-select'
import ThemeToggle from './theme-toggle'
import { SidebarTrigger } from './ui/sidebar'
import UserMenu from './user-menu'

type HeaderProps = {
	withSidebar?: boolean
}

const Header = ({ withSidebar = false }: HeaderProps) => {
	return (
		<header className="sticky top-0 z-30 flex w-full items-center justify-between gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur sm:px-6 md:px-8">
			<div className="flex min-w-0 items-center gap-3">
				{withSidebar && <SidebarTrigger className="shrink-0 md:hidden" />}
				<div className="min-w-0" />
			</div>
			<div className="flex items-center gap-2 sm:gap-3">
				<LanguageSelect />
				<ThemeToggle />
				<UserMenu />
			</div>
		</header>
	)
}

export default Header
