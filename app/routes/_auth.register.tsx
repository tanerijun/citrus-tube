import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import {
	json,
	redirect,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from "@remix-run/cloudflare"
import { Form, Link, useActionData } from "@remix-run/react"
import { useId } from "react"
import { z } from "zod"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { AutoAnimateContainer } from "~/components/ui/auto-animate-container"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { getAuth } from "~/lib/auth.server"
import { commitSession, getSession } from "~/lib/session.server"

const schema = z
	.object({
		username: z
			.string({ required_error: "Username is required" })
			.min(3, "Username must be at least 3 characters")
			.max(12, "Username can't be longer than 12 characters"),
		email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
		password: z
			.string({ required_error: "Password is required" })
			.min(6, "Password should be at least 6 characters")
			.refine((password) => !password.includes(" "), "Password shouldn't contain whitespaces"),
		confirmPassword: z.string({ required_error: "Confirm your password" }),
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Passwords don't match",
				path: ["confirmPassword"],
			})
		}
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

	const { username, email, password } = submission.value

	try {
		await auth.register({
			username,
			email,
			password,
		})

		const session = await getSession(request.headers.get("Cookie"))
		session.flash("message", "Registration successful")

		return redirect("/login", {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		})
	} catch (error) {
		if (error instanceof Error) {
			return json({ submission, message: error.message })
		}
		return json({ submission, message: "Unexpected error" })
	}
}

export default function Register() {
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
				<CardTitle>Welcome to Citrus!</CardTitle>
				<CardDescription>Register for an account.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form method="post" className="flex w-full flex-col gap-6" {...form.props}>
					{data?.message && (
						<Alert variant="destructive" className="text-center">
							<AlertDescription>{data.message}</AlertDescription>
						</Alert>
					)}
					<AutoAnimateContainer className="flex flex-col gap-2">
						<Label htmlFor={fields.username.id}>Username</Label>
						<Input {...conform.input(fields.username, { type: "text" })} />
						{fields.username.error && (
							<p id={fields.username.errorId} className="text-xs text-destructive">
								{fields.username.error}
							</p>
						)}
					</AutoAnimateContainer>
					<AutoAnimateContainer className="flex flex-col gap-2">
						<Label htmlFor={fields.email.id}>Email</Label>
						<Input {...conform.input(fields.email, { type: "email" })} />
						{fields.email.error && (
							<p id={fields.email.errorId} className="text-xs text-destructive">
								{fields.email.error}
							</p>
						)}
					</AutoAnimateContainer>
					<AutoAnimateContainer className="flex flex-col gap-2">
						<Label htmlFor={fields.password.id}>Password</Label>
						<Input {...conform.input(fields.password, { type: "password" })} />
						{fields.password.error && (
							<p id={fields.password.errorId} className="text-xs text-destructive">
								{fields.password.error}
							</p>
						)}
					</AutoAnimateContainer>
					<AutoAnimateContainer className="flex flex-col gap-2">
						<Label htmlFor={fields.confirmPassword.id}>Confirm password</Label>
						<Input {...conform.input(fields.confirmPassword, { type: "password" })} />
						{fields.confirmPassword.error && (
							<p id={fields.confirmPassword.errorId} className="text-xs text-destructive">
								{fields.confirmPassword.error}
							</p>
						)}
					</AutoAnimateContainer>
					<Button type="submit">Register</Button>
					<small>
						Already have an account?{" "}
						<Link to="/login" className="text-primary hover:underline">
							Login
						</Link>
					</small>
				</Form>
			</CardContent>
		</Card>
	)
}
