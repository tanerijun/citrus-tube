import { user, type NewUser } from "~/lib/db/schema.server"
import { db } from "../db/client.server"
import { hash } from "../password-hash"

export async function createAccount(userData: NewUser) {
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

	if (!res || !res.id) {
		throw new Error("Registration failed")
	}

	return res
}
