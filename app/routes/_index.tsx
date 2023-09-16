import {
	type ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { authenticator } from "~/lib/auth/authenticator.server"

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
	const user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" })

	return json(user)
}

export const action = async ({ request }: ActionFunctionArgs) => {
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
