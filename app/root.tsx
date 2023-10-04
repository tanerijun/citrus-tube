import { json, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/cloudflare"
import { cssBundleHref } from "@remix-run/css-bundle"
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react"
import { useEffect } from "react"
import { Toaster } from "~/components/ui/toaster"
import { toast } from "~/components/ui/use-toast"
import { commitSession, getSession } from "~/lib/session.server"
import globalStyles from "~/styles/global.css"

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
	{ rel: "stylesheet", href: globalStyles },
]

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"))
	const message = session.get("message")

	return json(
		{ message, ENV: { CLOUDINARY_CLOUD_NAME: context.CLOUDINARY_CLOUD_NAME } },
		{ headers: { "Set-Cookie": await commitSession(session) } },
	)
}

export default function App() {
	const loaderData = useLoaderData<typeof loader>()

	useEffect(() => {
		if (loaderData.message) {
			toast({ description: loaderData.message })
		}
	}, [loaderData.message])

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<Toaster />
				<ScrollRestoration />
				<script
					dangerouslySetInnerHTML={{ __html: `window.ENV = ${JSON.stringify(loaderData.ENV)}` }}
				/>
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
