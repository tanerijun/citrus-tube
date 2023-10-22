import { json, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare"
import { Outlet, type MetaFunction } from "@remix-run/react"
import { Navbar } from "~/routes/_home/navbar"
import { Sidebar, SidebarProvider, SidebarTrigger } from "~/routes/_home/sidebar"
import { getAuth } from "~/server/auth.server"
import { getUserData } from "~/server/services/user.server"

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

	const { username, profileImageUrl } = userData

	return json({ user: { username, profileImageUrl } })
}

export default function HomeLayout() {
	return (
		<div className="flex min-h-screen flex-col">
			<SidebarProvider>
				<Navbar>
					<SidebarTrigger />
				</Navbar>
				<div className="flex flex-1">
					<Sidebar />
					<main className="w-full p-4">
						<Outlet />
					</main>
				</div>
			</SidebarProvider>
		</div>
	)
}
