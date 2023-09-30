import { eq } from "drizzle-orm"
import { getDb } from "../db.server"
import { user } from "../schema.server"

export async function getCompleteUserData(id: number) {
	const db = getDb()
	const userData = await db.select().from(user).where(eq(user.id, id)).get()
	return userData
}

export async function getUserData(id: number) {
	const completeUserData = await getCompleteUserData(id)

	if (!completeUserData) {
		return completeUserData
	}

	const { id: userId, username, email, profileImageUrl, backgroundImageUrl } = completeUserData

	return {
		id: userId,
		username,
		email,
		profileImageUrl,
		backgroundImageUrl,
	}
}
