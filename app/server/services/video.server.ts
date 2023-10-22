import { getDb } from "../db.server"

export async function getVideos(count = 20) {
	const db = getDb()

	return await db.query.video.findMany({
		with: { owner: { columns: { id: true, username: true, profileImageUrl: true } } },
		limit: count,
	})
}

export async function getVideoById(id: number) {
	const db = getDb()

	return await db.query.video.findFirst({
		with: { owner: { columns: { id: true, username: true, profileImageUrl: true } } },
		where: (video, { eq }) => eq(video.id, id),
	})
}

export async function getVideosLike(pattern: string) {
	const db = getDb()

	return await db.query.video.findMany({
		with: { owner: { columns: { id: true, username: true, profileImageUrl: true } } },
		where: (video, { like }) => like(video.title, `%${pattern}%`),
	})
}
