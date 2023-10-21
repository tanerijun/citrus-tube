import { getDb } from "../db.server"

export async function getVideos(count = 20) {
	const db = getDb()

	const results = (await db.query.video.findMany({ with: { owner: true }, limit: count })).map(
		({ owner, ...rest }) => ({
			owner: { id: owner.id, username: owner.username, profileImageUrl: owner.profileImageUrl },
			...rest,
		}),
	)

	return results
}
