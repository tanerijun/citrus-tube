import { type LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare"
import { type MetaFunction, Outlet, useLoaderData } from "@remix-run/react"
import { getAuth } from "~/lib/auth.server"
import { getUserData } from "~/lib/services/user.server"
import { Navbar } from "~/routes/_home/navbar"
import { Sidebar } from "~/routes/_home/sidebar"

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
	const { user } = useLoaderData<typeof loader>()

	return (
		<div className="flex min-h-screen flex-col">
			<Navbar userData={user} />
			<div className="flex flex-1">
				<Sidebar />
				<main>
					<Outlet />
				</main>
			</div>
		</div>
	)
}