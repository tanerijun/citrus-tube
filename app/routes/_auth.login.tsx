import { type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare"
import { Form } from "@remix-run/react"
import { getAuth } from "~/lib/auth.server"

export async function loader({ request, context }: LoaderFunctionArgs) {
	return await getAuth(context).authenticator.isAuthenticated(request, { successRedirect: "/" })
}

export async function action({ request, context }: ActionFunctionArgs) {
	const auth = getAuth(context)

	return await auth.authenticator.authenticate(auth.strategy.email, request, {
		successRedirect: "/",
	})
}

export default function Login() {
	return (
		<Form method="post">
			<label>
				Email
				<input className="border border-black" type="email" name="email" required />
			</label>
			<label>
				Password
				<input className="border border-black" type="password" name="password" required />
			</label>
			<button type="submit">Login</button>
		</Form>
	)
}
