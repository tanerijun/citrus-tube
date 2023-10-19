import { fill } from "@cloudinary/url-gen/actions/resize"
import { Cloudinary } from "@cloudinary/url-gen/index"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { Link, useLoaderData } from "@remix-run/react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Card, CardContent } from "~/components/ui/card"
import { getAuth } from "~/lib/auth.server"
import { getVideos } from "~/lib/services/video.server"

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const videos = (await getVideos()).map((video) => {
		const cld = new Cloudinary({ cloud: { cloudName: context.CLOUDINARY_CLOUD_NAME as string } }) // TODO: eliminate "as string"

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

	console.log(videos)

	return (
		<div className="grid grid-cols-3 gap-4">
			{videos.map((video) => {
				return (
					<Link key={video.id} to={`video/${video.id}`}>
						<Card className="h-full">
							<CardContent className="flex flex-col gap-4 p-2">
								<img src={video.thumbnailUrl} alt={video.title} />
								<div className="flex gap-4">
									<Avatar>
										<AvatarImage
											src={video.owner.profileImageUrl ?? undefined}
											alt={video.owner.username}
										/>
										<AvatarFallback>
											{video.owner.username.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<h3 className="line-clamp-2 font-bold">{video.title}</h3>
										<Link to={`user/${video.owner.id}`} className="text-sm">
											{video.owner.username}
										</Link>
										<span className="text-sm">10 views · 4 days ago</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				)
			})}
		</div>
	)
}
