import { user, type NewUser, type User } from "~/lib/db/schema.server"
import { db } from "../db/client.server"
import { hash, verify } from "../password-hash"

export async function createAccount(userData: Pick<User, "username" | "email" | "password">) {
	const existingUser = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.email, userData.email),
	})

	if (existingUser) {
		throw new Error("User already exist")
	}

	const { password, ...rest } = userData

	const hashedPassword = await hash({ password: password })

	const newUser: NewUser = {
		...rest,
		password: hashedPassword,
		createdAt: new Date(),
	}

	const res = db.insert(user).values(newUser).returning().get()

	if (!res) {
		throw new Error("Registration failed")
	}

	return res
}

export async function getAccount(userData: Pick<User, "email" | "password">) {
	const res = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.email, userData.email),
	})

	if (!res) {
		throw new Error("User doesn't exist")
	}

	const isValidPassword = await verify({ hash: res.password, password: userData.password })

	if (!isValidPassword) {
		throw new Error("Invalid password")
	}

	return res
}
