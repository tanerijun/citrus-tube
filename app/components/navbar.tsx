import { Form, Link } from "@remix-run/react"
import { HamburgerIcon } from "./icons/hamburger"
import { Button } from "./ui/button"
import { CitrusIcon } from "./icons/citrus"
import { Input } from "./ui/input"
import { SearchIcon } from "./icons/search"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { UserSquareIcon } from "./icons/user-square"
import { LayoutDashboardIcon } from "./icons/layout-dashboard"
import { HelpCircleIcon } from "./icons/help-circle"
import { AlertCircleIcon } from "./icons/alert-circle"
import { BugIcon } from "./icons/bug"
import { LogoutIcon } from "./icons/logout"
import { Cloudinary } from "@cloudinary/url-gen/index"

type UserData = { username: string; profileImageUrl: string | null }

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

function Menu({ userData }: { userData: UserData }) {
	let { username, profileImageUrl } = userData

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

export function Navbar({ userData }: { userData: UserData | null }) {
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
				{userData ? <Menu userData={userData} /> : <AuthLink />}
			</div>
		</header>
	)
}
