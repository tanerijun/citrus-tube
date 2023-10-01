import {
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
	json,
	redirect,
} from "@remix-run/cloudflare"
import { type MetaFunction, Outlet, useLoaderData, Link, Form } from "@remix-run/react"
import { Cloudinary } from "@cloudinary/url-gen"
import { CitrusIcon } from "~/components/icons/citrus"
import { SearchIcon } from "~/components/icons/search"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { getAuth } from "~/lib/auth.server"
import { getUserData } from "~/lib/services/user.server"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { UserSquareIcon } from "~/components/icons/user-square"
import { LayoutDashboardIcon } from "~/components/icons/layout-dashboard"
import { HelpCircleIcon } from "~/components/icons/help-circle"
import { AlertCircleIcon } from "~/components/icons/alert-circle"
import { BugIcon } from "~/components/icons/bug"
import { LogoutIcon } from "~/components/icons/logout"

export const meta: MetaFunction = () => {
	return [
		{ title: "CitrusTube" },
		{
			name: "description",
			content: "A citrus-flavored video sharing platform inspired by Youtube",
		},
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userSession = await getAuth().authenticator.isAuthenticated(request)

	if (!userSession) {
		return json({ user: null })
	}

	const userData = await getUserData(userSession.id)

	if (!userData) {
		throw redirect("/login")
	}

	return json({ user: userData })
}

export const action = async ({ request }: ActionFunctionArgs) => {
	await getAuth().authenticator.logout(request, { redirectTo: "/" })
}

function Logo() {
	return (
		<Link to="/">
			<div className="flex items-center justify-center gap-0">
				<CitrusIcon className="text-primary h-10 w-10" />
				<h2 className="text-primary text-4xl font-bold">Citrus</h2>
			</div>
		</Link>
	)
}

function Searchbar() {
	return (
		<div className="relative w-full max-w-lg">
			<Input className="pr-14" type="text" placeholder="Search videos" />
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
			<Button asChild variant="ghost">
				<Link to="/register">Register</Link>
			</Button>
			<Button asChild>
				<Link to="/login">Login</Link>
			</Button>
		</nav>
	)
}

function Menu() {
	const { user } = useLoaderData<typeof loader>()

	if (!user) {
		return <AuthLink />
	}

	let { profileImageUrl } = user

	if (profileImageUrl && typeof window !== "undefined" && window.ENV?.CLOUDINARY_CLOUD_NAME) {
		const cld = new Cloudinary({ cloud: { cloudName: window.ENV.CLOUDINARY_CLOUD_NAME } })
		profileImageUrl = cld.image(profileImageUrl).toURL()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="overflow-hidden rounded-full" variant="ghost" size="icon">
					<Avatar>
						<AvatarImage src={profileImageUrl ?? undefined} alt={user.username} />
						<AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<div className="flex items-center gap-4 px-3 py-2">
					<Avatar>
						<AvatarImage src={profileImageUrl ?? undefined} alt={user.username} />
						<AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
					</Avatar>
					<span>{"@" + user.username}</span>
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
					<Form method="POST">
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

function Navbar() {
	return (
		<header className="mx-12 flex items-center justify-between py-4">
			<Logo />
			<Searchbar />
			<Menu />
		</header>
	)
}

export default function HomeLayout() {
	return (
		<main>
			<Navbar />
			<Outlet />
		</main>
	)
}
