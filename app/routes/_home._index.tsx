import { fill } from "@cloudinary/url-gen/actions/resize"
import { Cloudinary } from "@cloudinary/url-gen/index"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { Link, useLoaderData } from "@remix-run/react"
import { formatDistanceToNowStrict } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Card, CardContent } from "~/components/ui/card"
import { getAuth } from "~/lib/auth.server"
import { getVideos } from "~/lib/services/video.server"

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const videos = (await getVideos()).map((video) => {
		const cld = new Cloudinary({ cloud: { cloudName: context.CLOUDINARY_CLOUD_NAME } })

		return {
			...video,
			thumbnailUrl: cld.image(video.thumbnailUrl).resize(fill().width(500).height(300)).toURL(),
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

export const action = async ({ request }: ActionFunctionArgs) => {
	await getAuth().authenticator.logout(request, { redirectTo: "/" })
}

export default function Index() {
	const videos = useLoaderData<typeof loader>()

	return (
		<div className="grid grid-cols-3 gap-4">
			{videos.map((video) => {
				return (
					<Card key={video.id} className="relative h-full">
						<CardContent className="relative flex h-full flex-col gap-4 p-2">
							<img src={video.thumbnailUrl} alt={video.title} />
							<div className="flex gap-4">
								<Link to={`user/${video.owner.id}`} className="z-10">
									<Avatar>
										<AvatarImage
											src={video.owner.profileImageUrl ?? undefined}
											alt={video.owner.username}
										/>
										<AvatarFallback>
											{video.owner.username.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</Link>
								<div className="flex flex-col">
									<h3 className="line-clamp-2 font-bold">
										<Link to={`video/${video.id}`} className="z-10">
											{video.title}
										</Link>
									</h3>
									<Link to={`user/${video.owner.id}`} className="z-10 text-sm">
										{video.owner.username}
									</Link>
									<span className="text-sm">
										10 views · {formatDistanceToNowStrict(new Date(video.createdAt))} ago
									</span>
								</div>
								{/* Link overlay for the whole card */}
								<Link
									to={`video/${video.id}`}
									className="absolute inset-0 z-0 overflow-hidden whitespace-nowrap indent-[100%]"
								>
									Watch video
								</Link>
							</div>
						</CardContent>
					</Card>
				)
			})}
		</div>
	)
}
