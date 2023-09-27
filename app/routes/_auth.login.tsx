import { type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare"
import { Form, Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
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
		<main className="mx-6 flex h-screen items-center justify-center">
			<Form
				method="post"
				className="border-input flex w-full flex-col gap-6 rounded-md border p-10 md:w-96"
			>
				<div className="flex flex-col gap-2">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" name="email" required />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" name="password" required />
				</div>
				<Button type="submit">Login</Button>
				<small>
					Don't have an account?{" "}
					<Link to="/register" className="text-primary hover:underline">
						Register
					</Link>
				</small>
			</Form>
		</main>
	)
}
