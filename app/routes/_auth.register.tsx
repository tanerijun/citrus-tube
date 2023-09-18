import { type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "@remix-run/cloudflare"
import { Form } from "@remix-run/react"
import { getAuth } from "~/lib/auth.server"

export async function loader({ request, context }: LoaderFunctionArgs) {
	return await getAuth(context).authenticator.isAuthenticated(request, { successRedirect: "/" })
}

export async function action({ request, context }: ActionFunctionArgs) {
	const formData = await request.formData()
	const username = formData.get("username")
	const email = formData.get("email")
	const password = formData.get("password")

	// TODO: validate
	if (!username || !email || !password) {
		throw new Error("Invalid form fields")
	}

	const auth = getAuth(context)

	await auth.register({
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
