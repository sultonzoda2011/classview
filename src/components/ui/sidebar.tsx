/* eslint-disable react-refresh/only-export-components */
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { PanelLeft } from 'lucide-react'
import * as React from 'react'
import { useIsMobile } from '../../hooks/use-mobile'
import { cn } from '../../lib/utils'
import { Button } from './button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle
} from './sheet'

const SIDEBAR_STORAGE_KEY = 'sidebar:open'
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

type SidebarContextProps = {
	state: 'expanded' | 'collapsed'
	open: boolean
	setOpen: (open: boolean) => void
	openMobile: boolean
	setOpenMobile: (open: boolean) => void
	isMobile: boolean
	toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

// eslint-disable-next-line react-refresh/only-export-components -- useSidebar lives next to its provider, as in the original shadcn/ui
function useSidebar() {
	const context = React.useContext(SidebarContext)
	if (!context)
		throw new Error('useSidebar must be used inside <SidebarProvider>')
	return context
}

const readStoredOpen = () => {
	try {
		return localStorage.getItem(SIDEBAR_STORAGE_KEY) !== 'false'
	} catch {
		return true
	}
}

function SidebarProvider({
	className,
	style,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const isMobile = useIsMobile()
	const [openMobile, setOpenMobile] = React.useState(false)
	const [open, setOpenState] = React.useState(readStoredOpen)

	const setOpen = React.useCallback((value: boolean) => {
		setOpenState(value)
		try {
			localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value))
		} catch {
			/* If storage is unavailable, keep state in memory only. */
		}
	}, [])

	const toggleSidebar = React.useCallback(() => {
		if (isMobile) setOpenMobile(v => !v)
		else setOpen(!open)
	}, [isMobile, open, setOpen])

	React.useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (
				event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
				(event.metaKey || event.ctrlKey)
			) {
				event.preventDefault()
				toggleSidebar()
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [toggleSidebar])

	const value = React.useMemo<SidebarContextProps>(
		() => ({
			state: open ? 'expanded' : 'collapsed',
			open,
			setOpen,
			openMobile,
			setOpenMobile,
			isMobile,
			toggleSidebar
		}),
		[open, setOpen, openMobile, isMobile, toggleSidebar]
	)

	return (
		<SidebarContext.Provider value={value}>
			<div
				data-slot="sidebar-wrapper"
				style={
					{ '--sidebar-width': SIDEBAR_WIDTH, ...style } as React.CSSProperties
				}
				className={cn('flex min-h-svh w-full', className)}
				{...props}
			>
				{children}
			</div>
		</SidebarContext.Provider>
	)
}

function Sidebar({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

	if (isMobile) {
		return (
			<Sheet
				open={openMobile}
				onOpenChange={setOpenMobile}
			>
				<SheetContent
					side="left"
					data-sidebar="sidebar"
					data-mobile="true"
					style={
						{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties
					}
					className="w-(--sidebar-width) max-w-none gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground sm:max-w-none"
				>
					<SheetHeader className="sr-only">
						<SheetTitle>Navigation</SheetTitle>
						<SheetDescription>Main navigation</SheetDescription>
					</SheetHeader>
					<div className="flex h-full w-full flex-col">{children}</div>
				</SheetContent>
			</Sheet>
		)
	}

	return (
		<div
			data-slot="sidebar"
			data-state={state}
			className="group peer text-sidebar-foreground"
		>
			{/* Reserve flow space so the layout animates cleanly when the sidebar collapses. */}
			<div className="relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[state=collapsed]:w-0" />
			<aside
				data-sidebar="sidebar"
				className={cn(
					'fixed inset-y-0 left-0 z-20 flex h-svh w-(--sidebar-width) flex-col border-r border-sidebar-border bg-sidebar transition-[left] duration-200 ease-linear group-data-[state=collapsed]:left-[calc(var(--sidebar-width)*-1)]',
					className
				)}
				{...props}
			>
				{children}
			</aside>
		</div>
	)
}

function SidebarTrigger({
	className,
	onClick,
	...props
}: React.ComponentProps<typeof Button>) {
	const { toggleSidebar } = useSidebar()
	return (
		<Button
			data-sidebar="trigger"
			variant="ghost"
			size="icon-sm"
			className={cn(className)}
			onClick={event => {
				onClick?.(event)
				toggleSidebar()
			}}
			{...props}
		>
			<PanelLeft />
			<span className="sr-only">Toggle sidebar</span>
		</Button>
	)
}

function SidebarHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-sidebar="header"
			className={cn('flex flex-col gap-2 p-4', className)}
			{...props}
		/>
	)
}

function SidebarFooter({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-sidebar="footer"
			className={cn('flex flex-col gap-2 p-4', className)}
			{...props}
		/>
	)
}

function SidebarContent({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-sidebar="content"
			className={cn(
				'flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-2 py-2',
				className
			)}
			{...props}
		/>
	)
}

function SidebarGroup({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-sidebar="group"
			className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
			{...props}
		/>
	)
}

function SidebarGroupLabel({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-sidebar="group-label"
			className={cn(
				'flex h-8 shrink-0 items-center px-2 text-xs font-medium text-sidebar-muted',
				className
			)}
			{...props}
		/>
	)
}

function SidebarGroupContent({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-sidebar="group-content"
			className={cn('w-full text-sm', className)}
			{...props}
		/>
	)
}

function SidebarMenu({
	className,
	...props
}: React.HTMLAttributes<HTMLUListElement>) {
	return (
		<ul
			data-sidebar="menu"
			className={cn('flex w-full min-w-0 flex-col gap-1', className)}
			{...props}
		/>
	)
}

function SidebarMenuItem({
	className,
	...props
}: React.HTMLAttributes<HTMLLIElement>) {
	return (
		<li
			data-sidebar="menu-item"
			className={cn('relative', className)}
			{...props}
		/>
	)
}

const sidebarMenuButtonVariants = cva(
	"relative flex w-full items-center gap-3 overflow-hidden rounded-md px-3 text-left text-sm font-medium text-sidebar-foreground/80 outline-none transition-colors before:absolute before:top-1/2 before:left-0 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-sidebar-primary before:opacity-0 before:content-[''] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:before:opacity-100 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
	{
		variants: { size: { default: 'h-9', lg: 'h-11' } },
		defaultVariants: { size: 'default' }
	}
)

type SidebarMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	asChild?: boolean
	isActive?: boolean
	size?: 'default' | 'lg'
}

function SidebarMenuButton({
	asChild = false,
	isActive = false,
	size = 'default',
	className,
	...props
}: SidebarMenuButtonProps) {
	const Comp = asChild ? Slot : 'button'
	return (
		<Comp
			data-sidebar="menu-button"
			data-active={isActive}
			aria-current={isActive ? 'page' : undefined}
			className={cn(sidebarMenuButtonVariants({ size }), className)}
			{...props}
		/>
	)
}

export {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	useSidebar
}
