import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/cloudflare"
import { Form, Link, useActionData } from "@remix-run/react"
import { useId } from "react"
import { AuthorizationError } from "remix-auth"
import { z } from "zod"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { AutoAnimateContainer } from "~/components/ui/auto-animate-container"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { getAuth } from "~/lib/auth.server"

const schema = z.object({
	email: z.string({ required_error: "Email is required" }).email("Email is invalid"),
	password: z.string({ required_error: "Password is required" }),
})

export async function loader({ request }: LoaderFunctionArgs) {
	return await getAuth().authenticator.isAuthenticated(request, { successRedirect: "/" })
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.clone().formData()

	const submission = parse(formData, { schema })

	if (submission.intent !== "submit" || !submission.value) {
		return json({ submission, message: null })
	}

	const auth = getAuth()

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
		<Card className="min-w-full sm:min-w-[26rem]">
			<CardHeader>
				<CardTitle>Welcome back to Citrus!</CardTitle>
				<CardDescription>Please enter your email and password.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form method="post" className="flex w-full flex-col gap-6" {...form.props}>
					{data?.message && (
						<Alert variant="destructive" className="text-center">
							<AlertDescription>{data.message}</AlertDescription>
						</Alert>
					)}
					<AutoAnimateContainer className="flex flex-col gap-2">
						<Label htmlFor={fields.email.id}>Email</Label>
						<Input {...conform.input(fields.email, { type: "email" })} />
						{fields.email.error && (
							<p id={fields.email.errorId} className="text-destructive text-xs">
								{fields.email.error}
							</p>
						)}
					</AutoAnimateContainer>
					<AutoAnimateContainer className="flex flex-col gap-2">
						<Label htmlFor={fields.password.id}>Password</Label>
						<Input {...conform.input(fields.password, { type: "password" })} />
						{fields.password.error && (
							<p id={fields.password.errorId} className="text-destructive text-xs">
								{fields.password.error}
							</p>
						)}
					</AutoAnimateContainer>
					<Button type="submit">Login</Button>
					<small>
						Don't have an account?{" "}
						<Link to="/register" className="text-primary hover:underline">
							Register
						</Link>
					</small>
				</Form>
			</CardContent>
		</Card>
	)
}
