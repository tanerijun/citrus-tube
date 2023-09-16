import { type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { authenticator } from "~/lib/auth/authenticator.server"
import { createAccount } from "~/lib/services/account.server"

export async function loader({ request }: LoaderFunctionArgs) {
	return authenticator.isAuthenticated(request, { successRedirect: "/" })
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const username = formData.get("username")
	const email = formData.get("email")
	const password = formData.get("password")

	// TODO: validate
	if (!username || !email || !password) {
		throw new Error("Invalid form fields")
	}

	await createAccount({
		username: username.toString(),
		email: email.toString(),
		password: password.toString(),
	})

	return redirect("/login")
}

export default function Register() {
	return (
		<Form method="post">
			<label>
				Username:
				<input className="border border-black" type="text" name="username" required />
			</label>
			<label>
				Email:
				<input className="border border-black" type="email" name="email" required />
			</label>
			<label>
				Password:
				<input className="border border-black" type="password" name="password" required />
			</label>
			<button type="submit">Register</button>
		</Form>
	)
}
