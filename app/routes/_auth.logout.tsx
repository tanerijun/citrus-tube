import { type ActionFunctionArgs } from "@remix-run/cloudflare"
import { getAuth } from "~/lib/auth.server"

export const action = async ({ request }: ActionFunctionArgs) => {
	await getAuth().authenticator.logout(request, { redirectTo: "/" })
}
