import { type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { EMAIL_PASSWORD_STRATEGY, authenticator } from "~/lib/auth/authenticator.server"

export async function loader({ request }: LoaderFunctionArgs) {
	return await authenticator.isAuthenticated(request, { successRedirect: "/" })
}

export async function action({ request }: ActionFunctionArgs) {
	return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
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
