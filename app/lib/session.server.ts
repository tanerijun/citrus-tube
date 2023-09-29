import { createCookieSessionStorage } from "@remix-run/cloudflare"
import { contextHasSecret } from "./helpers/context-type"
import { type UserSession } from "./auth.server"

type SessionData = {
	user: UserSession
	strategy: string
}

type SessionFlashData = {
	message: string
}

function initializeCookieSessionStorage(context: Record<string, unknown>) {
	if (!contextHasSecret(context)) {
		throw new Error("No SECRET_KEY in context")
	}

	return createCookieSessionStorage<SessionData, SessionFlashData>({
		cookie: {
			name: "__session",
			sameSite: "lax",
			path: "/",
			httpOnly: true,
			secrets: [context.SECRET_KEY],
			secure: process.env.NODE_ENV === "production",
		},
	})
}

let sessionStorage: ReturnType<typeof initializeCookieSessionStorage> | null = null

export function initializeSessionStorage(context: Record<string, unknown>) {
	if (!sessionStorage) {
		sessionStorage = initializeCookieSessionStorage(context)
	}
}

export function getSessionStorage() {
	if (!sessionStorage) {
		throw new Error("Session Storage not initialized")
	}

	return sessionStorage
}
