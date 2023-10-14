// import { eq } from "drizzle-orm"
import { getDb } from "../db.server"

export async function getCompleteUserData(id: number) {
	const db = getDb()
	const userData = await db.query.user.findFirst({ where: (user, { eq }) => eq(user.id, id) })

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
