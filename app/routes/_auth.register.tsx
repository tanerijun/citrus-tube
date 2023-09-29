import {
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
	redirect,
	json,
} from "@remix-run/cloudflare"
import { z } from "zod"
import { Form, Link, useActionData } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { getAuth } from "~/lib/auth.server"
import { parse } from "@conform-to/zod"
import { useId } from "react"
import { conform, useForm } from "@conform-to/react"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { AutoAnimatedContainer } from "~/components/ui/auto-animated-container"

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

export async function loader({ request, context }: LoaderFunctionArgs) {
	return await getAuth(context).authenticator.isAuthenticated(request, { successRedirect: "/" })
}

export async function action({ request, context }: ActionFunctionArgs) {
	const formData = await request.clone().formData()

	const submission = parse(formData, { schema })

	if (submission.intent !== "submit" || !submission.value) {
		console.log("INSIDE IF", submission.value)
		return json({ submission, message: null })
	}

	const auth = getAuth(context)

	const { username, email, password } = submission.value

	try {
		await auth.register({
			username,
			email,
			password,
		})
		return redirect("/login")
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
		<main className="mx-10 flex h-screen flex-col items-center justify-center gap-6">
			<h2 className="text-2xl">Welcome to Citrus!</h2>
			<Form
				method="post"
				className="border-input flex w-full flex-col gap-6 rounded-md border p-12 md:w-[32rem]"
				{...form.props}
			>
				{data?.message && (
					<Alert variant="destructive" className="text-center">
						<AlertDescription>{data.message}</AlertDescription>
					</Alert>
				)}
				<AutoAnimatedContainer className="flex flex-col gap-2">
					<Label htmlFor={fields.username.id}>Username</Label>
					<Input {...conform.input(fields.username, { type: "text" })} />
					{fields.username.error && (
						<p id={fields.username.errorId} className="text-destructive text-xs">
							{fields.username.error}
						</p>
					)}
				</AutoAnimatedContainer>
				<AutoAnimatedContainer className="flex flex-col gap-2">
					<Label htmlFor={fields.email.id}>Email</Label>
					<Input {...conform.input(fields.email, { type: "email" })} />
					{fields.email.error && (
						<p id={fields.email.errorId} className="text-destructive text-xs">
							{fields.email.error}
						</p>
					)}
				</AutoAnimatedContainer>
				<AutoAnimatedContainer className="flex flex-col gap-2">
					<Label htmlFor={fields.password.id}>Password</Label>
					<Input {...conform.input(fields.password, { type: "password" })} />
					{fields.password.error && (
						<p id={fields.password.errorId} className="text-destructive text-xs">
							{fields.password.error}
						</p>
					)}
				</AutoAnimatedContainer>
				<AutoAnimatedContainer className="flex flex-col gap-2">
					<Label htmlFor={fields.confirmPassword.id}>Confirm password</Label>
					<Input {...conform.input(fields.confirmPassword, { type: "password" })} />
					{fields.confirmPassword.error && (
						<p id={fields.confirmPassword.errorId} className="text-destructive text-xs">
							{fields.confirmPassword.error}
						</p>
					)}
				</AutoAnimatedContainer>
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
