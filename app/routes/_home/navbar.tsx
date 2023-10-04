import { Form, Link } from "@remix-run/react"
import { HamburgerIcon } from "~/components/icons/hamburger"
import { Button } from "~/components/ui/button"
import { CitrusIcon } from "~/components/icons/citrus"
import { Input } from "~/components/ui/input"
import { SearchIcon } from "~/components/icons/search"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { UserSquareIcon } from "~/components/icons/user-square"
import { LayoutDashboardIcon } from "~/components/icons/layout-dashboard"
import { HelpCircleIcon } from "~/components/icons/help-circle"
import { AlertCircleIcon } from "~/components/icons/alert-circle"
import { BugIcon } from "~/components/icons/bug"
import { LogoutIcon } from "~/components/icons/logout"
import { Cloudinary } from "@cloudinary/url-gen/index"
import { useHomeLayoutLoaderData } from "./route"

function Logo() {
	return (
		<Link to="/">
			<div className="flex items-center justify-center gap-0">
				<CitrusIcon className="text-primary h-8 w-8" />
				<h2 className="text-primary text-3xl font-bold">Citrus</h2>
			</div>
		</Link>
	)
}

function Searchbar() {
	return (
		<div className="relative w-full max-w-lg">
			<Input className="hidden pr-14 md:block" type="text" placeholder="Search videos" />
			<Button
				className="absolute right-0 top-1/2 -translate-y-1/2"
				variant="ghost"
				aria-label="search"
			>
				<SearchIcon className="h-5 w-5" />
			</Button>
		</div>
	)
}

function AuthLink() {
	return (
		<nav className="flex gap-4">
			<Button asChild variant="ghost" className="hidden md:block">
				<Link to="/register">Register</Link>
			</Button>
			<Button asChild>
				<Link to="/login">Login</Link>
			</Button>
		</nav>
	)
}

function Menu() {
	const { user } = useHomeLayoutLoaderData()

	if (!user) throw new Error("User data not found")

	let { username, profileImageUrl } = user

	if (profileImageUrl && typeof window !== "undefined" && window.ENV?.CLOUDINARY_CLOUD_NAME) {
		const cld = new Cloudinary({ cloud: { cloudName: window.ENV.CLOUDINARY_CLOUD_NAME } })
		profileImageUrl = cld.image(profileImageUrl).toURL()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="overflow-hidden rounded-full" variant="ghost" size="icon">
					<Avatar>
						<AvatarImage src={profileImageUrl ?? undefined} alt={username} />
						<AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<div className="flex items-center gap-4 px-3 py-2">
					<Avatar>
						<AvatarImage src={profileImageUrl ?? undefined} alt={username} />
						<AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
					</Avatar>
					<span>{"@" + username}</span>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<UserSquareIcon className="mr-2" />
					<span>Profile</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<LayoutDashboardIcon className="mr-2" />
					<span>Studio</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<HelpCircleIcon className="mr-2" />
					<span>Help</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<AlertCircleIcon className="mr-2" />
					<span>Feedback</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<BugIcon className="mr-2" />
					<span>Bug report</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Form method="POST" action="/logout">
						<button
							type="submit"
							className="text-destructive flex w-full items-center justify-start"
						>
							<LogoutIcon className="mr-2" />
							Log out
						</button>
					</Form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export function Navbar() {
	const { user } = useHomeLayoutLoaderData()

	return (
		<header className="mx-6 flex items-center gap-4 py-4">
			<div className="flex gap-1 md:gap-4">
				<Button variant="ghost" size="icon">
					<HamburgerIcon className="h-5 w-5" />
				</Button>
				<Logo />
			</div>
			<div className="flex flex-1 justify-end gap-1 md:justify-between md:gap-4">
				<div className="hidden md:block" />
				<Searchbar />
				{user ? <Menu /> : <AuthLink />}
			</div>
		</header>
	)
}
