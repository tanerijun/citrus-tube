import { Link } from "@remix-run/react"
import { createContext, useContext, useState } from "react"
import { HamburgerIcon } from "~/components/icons/hamburger"
import { HelpCircleIcon } from "~/components/icons/help-circle"
import { HistoryIcon } from "~/components/icons/history"
import { HomeIcon } from "~/components/icons/home"
import { PlaylistIcon } from "~/components/icons/playlist"
import { SettingsIcon } from "~/components/icons/settings"
import { ThumbsUpIcon } from "~/components/icons/thumbs-up"
import { UsersIcon } from "~/components/icons/users"
import { VideoIcon } from "~/components/icons/video"
import { Button } from "~/components/ui/button"
import { CSSAnimationContainer } from "~/components/ui/css-animation-container"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "~/components/ui/sheet"
import { cn, isSmallScreen } from "~/lib/utils"
import { Logo } from "./navbar"

const sidebarItems = [
	{ name: "Home", path: "/", icon: <HomeIcon /> },
	{ name: "Liked videos", path: "/liked", icon: <ThumbsUpIcon /> },
	{ name: "Your videos", path: "/your-videos", icon: <VideoIcon /> },
	{ name: "Playlist", path: "/playlist", icon: <PlaylistIcon /> },
	{ name: "History", path: "/history", icon: <HistoryIcon /> },
	{ name: "Following", path: "/following", icon: <UsersIcon /> },
]

const sidebarFooterItems = [
	{ name: "Settings", path: "/settings", icon: <SettingsIcon /> },
	{ name: "Help", path: "/help", icon: <HelpCircleIcon /> },
]

const SidebarContext = createContext<
	[boolean, React.Dispatch<React.SetStateAction<boolean>>] | null
>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<SidebarContext.Provider value={[isOpen, setIsOpen]}>
			<Sheet>{children}</Sheet>
		</SidebarContext.Provider>
	)
}

function useSidebar() {
	const contextValue = useContext(SidebarContext)

	if (contextValue === null) {
		throw new Error(
			"Could not find SidebarContext, please ensure the component is wrapped with it's context provider",
		)
	}

	return contextValue
}

export function SidebarTrigger() {
	const [isOpen, setIsOpen] = useSidebar()

	const toggleSidebar = () => {
		setIsOpen(!isOpen)
	}

	return (
		<Button variant="ghost" size="icon" onClick={toggleSidebar} className="-ml-0.5 hidden md:flex">
			<HamburgerIcon className="h-5 w-5" />
		</Button>
	)
}

function SidebarItems({ items, isExpanded }: { items: typeof sidebarItems; isExpanded: boolean }) {
	const [isOpen, setIsOpen] = useSidebar()

	const closeSidebar = () => {
		if (isOpen && isSmallScreen()) {
			setIsOpen(false)
		}
	}

	return (
		<div className="flex flex-col gap-2">
			{items.map((item) => (
				<Button
					key={item.name}
					variant="ghost"
					className="flex justify-start"
					asChild
					onClick={closeSidebar}
				>
					<Link to={item.path}>
						<span className="text-lg">{item.icon}</span>
						<CSSAnimationContainer
							asChild
							mount={isExpanded}
							onMountClass="animate-in fade-in duration-500"
							onUnmountClass="animate-out fade-out duration-500"
							className="ml-3 overflow-x-hidden whitespace-nowrap"
						>
							<span>{item.name}</span>
						</CSSAnimationContainer>
					</Link>
				</Button>
			))}
		</div>
	)
}

// TODO: Change link color when it's active
export function Sidebar() {
	const [isOpen] = useSidebar()

	return (
		<aside
			className={cn(
				"hidden w-[5.3rem] flex-col justify-between p-4 transition-all duration-500 md:flex",
				isOpen && "w-64",
			)}
		>
			<SidebarItems items={sidebarItems} isExpanded={isOpen} />
			<SidebarItems items={sidebarFooterItems} isExpanded={isOpen} />
		</aside>
	)
}

export function MobileSidebarTrigger() {
	return (
		<SheetTrigger asChild className="md:hidden">
			<Button variant="ghost" size="icon" className="-ml-0.5">
				<HamburgerIcon className="h-5 w-5" />
			</Button>
		</SheetTrigger>
	)
}

export function MobileSidebar() {
	return (
		<SheetContent side="left" className="flex flex-col">
			<SheetHeader className="mb-6 ml-3 text-left">
				<Logo />
			</SheetHeader>
			<div className="flex h-full flex-col justify-between">
				<SidebarItems items={sidebarItems} isExpanded={true} />
				<SidebarItems items={sidebarFooterItems} isExpanded={true} />
			</div>
		</SheetContent>
	)
}
