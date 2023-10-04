import { Link } from "@remix-run/react"
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

// TODO: Change link color when it's active
export function Sidebar({ isOpen = true }: { isOpen?: boolean }) {
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
