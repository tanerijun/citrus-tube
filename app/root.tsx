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
import globalStyles from "~/styles/global.css"
import { Toaster } from "~/components/ui/toaster"
import { toast } from "~/components/ui/use-toast"
import { getSessionStorage } from "~/lib/session.server"
import { useEffect } from "react"

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
	{ rel: "stylesheet", href: globalStyles },
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { getSession } = getSessionStorage()
	const session = await getSession(request.headers.get("Cookie"))
	const message = session.get("message")

	return json({ message })
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
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
