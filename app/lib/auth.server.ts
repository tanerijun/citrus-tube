import { Authenticator } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import { user } from "./schema.server"
import type { NewUser, User } from "./schema.server"
import { createCookieSessionStorage } from "@remix-run/cloudflare"
import { getDb } from "./db.server"
import { eq } from "drizzle-orm"
import { hash, verify } from "./pbkdf2.server"

type UserSession = Pick<User, "id" | "username">

const EMAIL_PASSWORD_STRATEGY = "email-password-strategy"

class Auth {
	public authenticator
	public strategy
	private sessionStorage
	private db
	private secretKey

	constructor(context: Record<string, unknown>) {
		const isValidContext = (
			context: Record<string, unknown>,
		): context is { SECRET_KEY: string } => {
			return "SECRET_KEY" in context
		}

		if (!isValidContext(context)) {
			throw new Error("No SECRET_KEY in context")
		}

		this.secretKey = context.SECRET_KEY

		this.sessionStorage = createCookieSessionStorage({
			cookie: {
				name: "__session",
				sameSite: "lax",
				path: "/",
				httpOnly: true,
				secrets: [context.SECRET_KEY],
				secure: process.env.NODE_ENV === "production",
			},
		})

		this.db = getDb(context)

		this.strategy = {
			email: EMAIL_PASSWORD_STRATEGY,
		}

		this.authenticator = new Authenticator<UserSession>(this.sessionStorage)

		this.authenticator.use(
			new FormStrategy(async ({ form }) => {
				const email = form.get("email")
				const password = form.get("password")

				if (!email || !password) {
					throw new Error("Invalid form field")
				}

				const account = await this.login({ email: email.toString(), password: password.toString() })

				return { id: account.id, username: account.username }
			}),
			EMAIL_PASSWORD_STRATEGY,
		)
	}

	private async login(userData: Pick<User, "email" | "password">) {
		const res = await this.db.select().from(user).where(eq(user.email, userData.email)).get()

		if (!res) {
			throw new Error("User doesn't exist")
		}

		const isValidPassword = await verify({
			hash: res.password,
			password: userData.password,
			pepper: this.secretKey,
		})

		if (!isValidPassword) {
			throw new Error("Invalid password")
		}

		return res
	}

	public async register(userData: Pick<User, "username" | "email" | "password">) {
		const existingUser = await this.db
			.select()
			.from(user)
			.where(eq(user.email, userData.email))
			.get()

		if (existingUser) {
			throw new Error("User already exist")
		}

		const { password, ...rest } = userData

		const hashedPassword = await hash({ password: password, pepper: this.secretKey })

		const newUser: NewUser = {
			...rest,
			password: hashedPassword,
		}

		const res = this.db.insert(user).values(newUser).returning().get()

		if (!res) {
			throw new Error("Registration failed")
		}

		return res
	}
}

export function getAuth(context: Record<string, unknown>) {
	return new Auth(context)
}
