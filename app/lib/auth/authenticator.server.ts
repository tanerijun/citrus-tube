import { Authenticator } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import { sessionStorage } from "./storage.server"
import { getAccount } from "../services/account.server"
import { type User } from "../db/schema.server"

type UserSession = Pick<User, "id" | "username">

export const EMAIL_PASSWORD_STRATEGY = "email-password-strategy"

export const authenticator = new Authenticator<UserSession>(sessionStorage)

authenticator.use(
	new FormStrategy(async ({ form }) => {
		const email = form.get("email")
		const password = form.get("password")

		if (!email || !password) {
			throw new Error("Invalid form field")
		}

		const account = await getAccount({ email: email.toString(), password: password.toString() })

		return { id: account.id, username: account.username }
	}),
	EMAIL_PASSWORD_STRATEGY,
)
