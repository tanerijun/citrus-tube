import { createCookieSessionStorage } from "@remix-run/cloudflare"

const contextWithSecret = (context: Record<string, unknown>): context is { SECRET_KEY: string } => {
	return "SECRET_KEY" in context
}

function initializeCookieSessionStorage(context: Record<string, unknown>) {
	if (!contextWithSecret(context)) {
		throw new Error("No SECRET_KEY in context")
	}

	return createCookieSessionStorage({
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
