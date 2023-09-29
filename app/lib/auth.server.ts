import { Authenticator } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import { user } from "./schema.server"
import type { NewUser, User } from "./schema.server"
import { getDb } from "./db.server"
import { eq } from "drizzle-orm"
import { hash, verify } from "./pbkdf2.server"
import { getSessionStorage } from "./session.server"

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

		this.sessionStorage = getSessionStorage()

		this.db = getDb()

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
		const existingUsername = await this.db
			.select()
			.from(user)
			.where(eq(user.username, userData.username))
			.get()

		if (existingUsername) {
			throw new Error("Username already used")
		}

		const existingEmail = await this.db
			.select()
			.from(user)
			.where(eq(user.email, userData.email))
			.get()

		if (existingEmail) {
			throw new Error("Email already used")
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

let auth: Auth | null = null

export const initializeAuth = (context: Record<string, unknown>) => {
	if (!auth) {
		auth = new Auth(context)
	}
}

export function getAuth() {
	if (!auth) {
		throw new Error("Auth not initialized")
	}

	return auth
}
