import { fill } from "@cloudinary/url-gen/actions/resize"
import { Cloudinary } from "@cloudinary/url-gen/index"
import type { LoaderFunctionArgs } from "@remix-run/cloudflare"
import { json, redirect } from "@remix-run/cloudflare"
import { Link, useLoaderData } from "@remix-run/react"
import { formatDistanceToNowStrict } from "date-fns"
import { MonitorXIcon } from "~/components/icons/monitor-x"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Card, CardContent } from "~/components/ui/card"
import { getVideosLike } from "~/server/services/video.server"

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const q = url.searchParams.get("q")

	if (!q) {
		throw redirect("/")
	}

	const videos = (await getVideosLike(q)).map((video) => {
		const cld = new Cloudinary({ cloud: { cloudName: context.CLOUDINARY_CLOUD_NAME } })

		return {
			...video,
			thumbnailUrl: cld.image(video.thumbnailUrl).resize(fill().width(250).height(150)).toURL(),
			owner: {
				...video.owner,
				profileImageUrl: video.owner.profileImageUrl
					? cld.image(video.owner.profileImageUrl).toURL()
					: null,
			},
		}
	})

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
		<div className="flex flex-col gap-4">
			{videos.map((video) => (
				<Card key={video.id} className="h-full overflow-hidden">
					<CardContent className="relative flex h-full gap-4 p-0">
						<img src={video.thumbnailUrl} alt={video.title} />
						<div className="flex flex-col py-2 pr-2">
							<h3 className="line-clamp-2 font-bold">
								<Link
									to={`video/${video.id}`}
									className="text-lg before:absolute before:inset-0 before:z-0 before:overflow-hidden before:whitespace-nowrap before:indent-[100] before:content-['']"
								>
									{video.title}
								</Link>
							</h3>
							<span className="text-sm">
								10 views · {formatDistanceToNowStrict(new Date(video.createdAt))} ago
							</span>
							<Link className="z-10 my-3 flex items-center gap-2" to={`user/${video.owner.id}`}>
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={video.owner.profileImageUrl ?? undefined}
										alt={video.owner.username}
									/>
									<AvatarFallback>{video.owner.username.slice(0, 2).toUpperCase()}</AvatarFallback>
								</Avatar>
								<span className="text-sm">{video.owner.username}</span>
							</Link>
							<p className="line-clamp-1 text-sm">{video.description}</p>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
