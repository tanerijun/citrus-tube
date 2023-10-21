import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/cloudflare"
import { getAuth } from "~/server/auth.server"

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
