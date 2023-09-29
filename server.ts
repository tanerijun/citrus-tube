import { logDevReady } from "@remix-run/cloudflare"
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages"
import * as build from "@remix-run/dev/server-build"
import { initializeDb } from "~/lib/db.server"

if (process.env.NODE_ENV === "development") {
	logDevReady(build)
}

export const onRequest = createPagesFunctionHandler({
	build,
	getLoadContext: (context) => {
		initializeDb(context.env)

		return context.env
	},
	mode: build.mode,
})
