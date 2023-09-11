import { type ActionArgs, json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { authenticator } from "~/lib/auth/authenticator.server"
import { db } from "~/lib/db/client.server"
import { createAccount, getAccount } from "~/lib/services/account.server"

export const meta: V2_MetaFunction = () => {
	return [
		{ title: "CitrusTube" },
		{
			name: "description",
			content: "A citrus-flavored video sharing platform inspired by Youtube",
		},
	]
}

export const loader = async ({ request }: LoaderArgs) => {
	const user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" })

	return json(user)
}

export const action = async ({ request }: ActionArgs) => {
	await authenticator.logout(request, { redirectTo: "/" })
}

export default function Index() {
	const user = useLoaderData<typeof loader>()

	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1 className="text-red-500 underline">Hello {user.username}!</h1>
			<Form method="post">
				<button type="submit">Log out</button>
			</Form>
		</div>
	)
}
