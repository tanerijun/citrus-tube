import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { type LoaderFunctionArgs, type ActionFunctionArgs, json } from "@remix-run/cloudflare"
import { Form, Link, useActionData } from "@remix-run/react"
import { useId } from "react"
import { AuthorizationError } from "remix-auth"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { getAuth } from "~/lib/auth.server"

const schema = z.object({
	email: z.string({ required_error: "Email is required" }).email("Email is invalid"),
	password: z.string({ required_error: "Password is required" }),
})

export async function loader({ request, context }: LoaderFunctionArgs) {
	return await getAuth(context).authenticator.isAuthenticated(request, { successRedirect: "/" })
}

export async function action({ request, context }: ActionFunctionArgs) {
	const formData = await request.clone().formData()

	const submission = parse(formData, { schema })

	if (submission.intent !== "submit" || !submission.value) {
		return json({ submission, message: null })
	}

	const auth = getAuth(context)

	try {
		return await auth.authenticator.authenticate(auth.strategy.email, request, {
			successRedirect: "/",
			throwOnError: true,
		})
	} catch (error) {
		if (error instanceof Response) throw error // redirects work by throwing a Response
		if (error instanceof AuthorizationError) {
			return json({ submission, message: error.message })
		}
		return json({ submission, message: "Error authenticating user" })
	}
}

export default function Login() {
	const data = useActionData<typeof action>()

	const msg = data?.message // TODO: toast this message if it exist

	const id = useId()

	const [form, fields] = useForm({
		id,
		lastSubmission: data?.submission,
		shouldValidate: "onBlur",
		onValidate({ formData }) {
			return parse(formData, { schema })
		},
	})

	return (
		<main className="mx-6 flex h-screen flex-col items-center justify-center gap-6">
			<h2 className="text-2xl">Welcome back to Citrus!</h2>
			<Form
				method="post"
				className="border-input flex w-full flex-col gap-6 rounded-md border p-10 md:w-96"
				{...form.props}
			>
				<div className="flex flex-col gap-2">
					<Label htmlFor={fields.email.id}>Email</Label>
					<Input {...conform.input(fields.email, { type: "email" })} />
					{fields.email.error && (
						<p id={fields.email.errorId} className="text-destructive text-sm">
							{fields.email.error}
						</p>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor={fields.password.id}>Password</Label>
					<Input {...conform.input(fields.password, { type: "password" })} />
					{fields.password.error && (
						<p id={fields.password.errorId} className="text-destructive text-sm">
							{fields.password.error}
						</p>
					)}
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
