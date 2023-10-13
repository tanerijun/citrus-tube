import { eq } from "drizzle-orm"
import { getDb } from "../db.server"
import { user, video } from "../schema.server"

export async function getVideos(count = 20) {
	const db = getDb()
	const results = await db
		.select({
			id: video.id,
			title: video.title,
			description: video.description,
			videoUrl: video.videoUrl,
			thumbnailUrl: video.thumbnailUrl,
			createdAt: video.createdAt,
			// UserData is shifted
			// Blocked by https://github.com/drizzle-team/drizzle-orm/issues/555
			user: {
				id: user.id,
				username: user.username,
				profileImageUrl: user.profileImageUrl,
			},
		})
		.from(video)
		.leftJoin(user, eq(video.userId, user.id))
		.limit(count)
		.all()

	return results
}
