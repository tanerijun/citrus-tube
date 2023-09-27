import { type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "@remix-run/cloudflare"
import { Form, Link } from "@remix-run/react"
import { IconCitrus } from "~/components/icons/citrus"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
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
		<main className="mx-6 flex h-screen flex-col items-center justify-center gap-6">
			<h2 className="text-2xl">Welcome to Citrus!</h2>
			<Form
				method="post"
				className="border-input flex w-full flex-col gap-6 rounded-md border p-10 md:w-96"
			>
				<div className="flex flex-col gap-2">
					<Label htmlFor="username">Username</Label>
					<Input id="username" type="text" name="username" required />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" name="email" required />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="password">Password</Label>
					<Input type="password" name="password" required />
				</div>
				<Button type="submit">Register</Button>
				<small>
					Already have an account?{" "}
					<Link to="/login" className="text-primary hover:underline">
						Login
					</Link>
				</small>
			</Form>
		</main>
	)
}
