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
	const [isOpen, setIsOpen] = useState(true)

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
		<Button variant="ghost" size="icon" onClick={toggleSidebar}>
			<HamburgerIcon className="h-5 w-5" />
		</Button>
	)
}

// TODO: Change link color when it's active
export function Sidebar() {
	const [isOpen] = useSidebar()

	return isOpen ? (
		<aside className="flex w-64 flex-col justify-between border border-red-300 p-4">
			<div className="flex flex-col gap-2">
				{sidebarItems.map((item) => (
					<Button key={item.name} variant="ghost" className="flex justify-start" asChild>
						<Link to={item.path}>
							<span className="mr-3 text-lg">{item.icon}</span>
							<span>{item.name}</span>
						</Link>
					</Button>
				))}
			</div>
			<div className="flex flex-col gap-2">
				{sidebarFooterItems.map((item) => (
					<Button key={item.name} variant="ghost" className="flex justify-start" asChild>
						<Link to={item.path}>
							<span className="mr-3 text-lg">{item.icon}</span>
							<span>{item.name}</span>
						</Link>
					</Button>
				))}
			</div>
		</aside>
	) : null
}
