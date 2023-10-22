import type { LoaderFunctionArgs } from "@remix-run/cloudflare"
import { json, redirect } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import { MonitorXIcon } from "~/components/icons/monitor-x"
import { getVideosLike } from "~/server/services/video.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const q = url.searchParams.get("q")

	if (!q) {
		throw redirect("/")
	}

	const videos = await getVideosLike(q)

	return json(videos)
}

export default function VideoSearchPage() {
	const videos = useLoaderData<typeof loader>()

	if (!videos.length) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-4">
				<MonitorXIcon className="text-9xl text-destructive" />
				<h3 className="text-3xl font-bold">No video found</h3>
				<p>Please try another search query</p>
			</div>
		)
	}

	return (
		<div>
			{videos.map((video) => (
				<div key={video.id}>{video.title}</div>
			))}
		</div>
	)
}
