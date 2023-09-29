import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare"
import { type MetaFunction, Outlet } from "@remix-run/react"
import { getAuth } from "~/lib/auth.server"

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
	const user = await getAuth().authenticator.isAuthenticated(request, {
		failureRedirect: "/login",
	})

	return json(user)
}

export default function HomeLayout() {
	return <Outlet />
}
