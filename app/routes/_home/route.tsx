import { json, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare"
import { Outlet, useLoaderData, type MetaFunction } from "@remix-run/react"
import { getAuth } from "~/lib/auth.server"
import { getUserData } from "~/lib/services/user.server"
import { Navbar } from "~/routes/_home/navbar"
import { Sidebar, SidebarProvider, SidebarTrigger } from "~/routes/_home/sidebar"

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

export function useHomeLayoutLoaderData() {
	return useLoaderData<typeof loader>()
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
					<main>
						<Outlet />
					</main>
				</div>
			</SidebarProvider>
		</div>
	)
}
