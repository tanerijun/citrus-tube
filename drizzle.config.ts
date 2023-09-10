import type { Config } from "drizzle-kit"

export default {
	schema: "./app/lib/db/schema.server.ts",
	out: "drizzle/migrations/",
	breakpoints: true,
	driver: "better-sqlite",
	dbCredentials: {
		url: "drizzle/dev.db",
	},
	verbose: true,
	strict: true,
} satisfies Config
