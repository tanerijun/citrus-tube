import { json } from "@remix-run/cloudflare"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare"
import { Form, useLoaderData } from "@remix-run/react"
import { getAuth } from "~/lib/auth.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await getAuth().authenticator.isAuthenticated(request)

	return json(user)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	await getAuth().authenticator.logout(request, { redirectTo: "/" })
}

export default function Index() {
	const user = useLoaderData<typeof loader>()

	return (
		<div>
			<h1 className="text-red-500 underline">Hello {user ? user.username : "Anonymous"}!</h1>
			<Form method="post">
				<button type="submit">Log out</button>
			</Form>
		</div>
	)
}
