import { createCookieSessionStorage } from "@remix-run/cloudflare"
import { eq } from "drizzle-orm"
import { Authenticator } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import { getDb } from "./db.server"
import { hash, verify } from "./pbkdf2.server"
import type { NewUser, User } from "./schema.server"
import { user } from "./schema.server"

type UserSession = Pick<User, "id" | "username">

class Auth {
	public authenticator
	public strategy
	private sessionStorage
	private db
	private secretKey

	constructor(secretKey: string) {
		this.secretKey = secretKey

		this.sessionStorage = createCookieSessionStorage({
			cookie: {
				name: "__session",
				sameSite: "lax",
				path: "/",
				httpOnly: true,
				secrets: [secretKey],
				secure: process.env.NODE_ENV === "production",
			},
		})

		this.db = getDb()

		this.strategy = {
			email: "email-password-strategy",
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
			this.strategy.email,
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

export const initializeAuth = (secretKey: string) => {
	if (!auth) {
		auth = new Auth(secretKey)
	}
}

export function getAuth() {
	if (!auth) {
		throw new Error("Auth not initialized")
	}

	return auth
}
