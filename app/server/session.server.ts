import { createCookieSessionStorage } from "@remix-run/cloudflare"

type SessionData = {}

type SessionFlashData = {
	message: string
}

export const { getSession, commitSession, destroySession } = createCookieSessionStorage<
	SessionData,
	SessionFlashData
>({
	cookie: {
		name: "session",
		sameSite: "lax",
		path: "/",
		httpOnly: true,
		secrets: ["citrus-tube"],
		secure: process.env.NODE_ENV === "production",
	},
})
