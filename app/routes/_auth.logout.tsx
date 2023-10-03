import { type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare"
import { getAuth } from "~/lib/auth.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const auth = getAuth()

	return auth.authenticator.isAuthenticated(request, {
		successRedirect: "/",
		failureRedirect: "/login",
	})
}

export const action = async ({ request }: ActionFunctionArgs) => {
	await getAuth().authenticator.logout(request, { redirectTo: "/" })
}
