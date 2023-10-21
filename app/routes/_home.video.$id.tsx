import type { LoaderFunctionArgs } from "@remix-run/cloudflare"

export const loader = ({ params }: LoaderFunctionArgs) => {
	console.log(params.id)
	return null
}

export default function VideoPage() {
	return <h1>Video</h1>
}
