import { type LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare"
import { type MetaFunction, Outlet, useLoaderData, Link } from "@remix-run/react"
import { CitrusIcon } from "~/components/icons/citrus"
import { SearchIcon } from "~/components/icons/search"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { getAuth } from "~/lib/auth.server"
import { getUserData } from "~/lib/services/user.server"

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

function UserInfo() {
	const { user } = useLoaderData<typeof loader>()

	if (!user) {
		return <AuthLink />
	}

	return <p>{user.profileImageUrl || "OK"}</p>
}

function Navbar() {
	return (
		<header className="mx-12 flex items-center justify-between py-4">
			<Logo />
			<Searchbar />
			<UserInfo />
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
