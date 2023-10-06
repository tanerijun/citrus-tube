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
import { AutoAnimatedContainer } from "~/components/ui/auto-animated-container"
import { Button } from "~/components/ui/button"
import { cn, isSmallScreen } from "~/lib/utils"

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

	return <SidebarContext.Provider value={[isOpen, setIsOpen]}>{children}</SidebarContext.Provider>
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
		<Button variant="ghost" size="icon" onClick={toggleSidebar} className="-ml-0.5">
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
					<AutoAnimatedContainer asChild>
						<Link to={item.path}>
							<span className={cn("text-lg", isExpanded && "mr-3")}>{item.icon}</span>
							{isExpanded && <span className="overflow-x-hidden">{item.name}</span>}
						</Link>
					</AutoAnimatedContainer>
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
				"flex-col justify-between border border-red-300 p-4 md:flex",
				!isOpen && "hidden",
				isOpen && "flex w-full md:w-64",
			)}
		>
			<SidebarItems items={sidebarItems} isExpanded={isOpen} />
			<SidebarItems items={sidebarFooterItems} isExpanded={isOpen} />
		</aside>
	)
}
