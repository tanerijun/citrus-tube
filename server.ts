import { logDevReady } from "@remix-run/cloudflare"
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages"
import * as build from "@remix-run/dev/server-build"
import { initializeAuth } from "~/lib/auth.server"
import { initializeDb } from "~/lib/db.server"

if (process.env.NODE_ENV === "development") {
	logDevReady(build)
}

// Environment variables (Cloudflare's globals)
interface Env {
	CLOUDINARY_CLOUD_NAME: string
	SECRET_KEY: string
	DB: D1Database
}

declare module "@remix-run/server-runtime" {
	interface AppLoadContext extends Env {}
}

type Context = EventContext<Env, string, unknown>

function validateEnvironmentVariables(context: Context) {
	if (!context.env.CLOUDINARY_CLOUD_NAME) {
		throw new Error("Env: CLOUDINARY_CLOUD_NAME must be set")
	}
	if (!context.env.SECRET_KEY) {
		throw new Error("Env: SECRET_KEY must be set")
	}
	if (!context.env.DB) {
		throw new Error("Binding: D1Database not found")
	}
}

export const onRequest = createPagesFunctionHandler({
	build,
	getLoadContext: (context: Context) => {
		validateEnvironmentVariables(context)
		initializeDb(context.env.DB)
		initializeAuth(context.env.SECRET_KEY)

		return { ...context.env }
	},
	mode: build.mode,
})
