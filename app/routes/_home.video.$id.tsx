import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import { getVideoById } from "~/server/services/video.server"

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const param = params.id
	if (!param) {
		throw new Error("Missing param: id")
	}

	const id = parseInt(param)
	if (isNaN(id)) {
		throw new Response("Not Found", { status: 404 })
	}

	const video = await getVideoById(id)
	if (!video) {
		throw new Response("Not Found", { status: 404 })
	}

	return json(video)
}

export default function VideoPage() {
	const video = useLoaderData<typeof loader>()

	return <h1>{video.title}</h1>
}
