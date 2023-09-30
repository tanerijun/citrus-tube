import { drizzle } from "drizzle-orm/d1"
import * as schema from "./schema.server"

function contextHasDb(context: Record<string, unknown>): context is { DB: D1Database } {
	return "DB" in context
}

const initializeDrizzleInstance = (context: Record<string, unknown>) => {
	if (!contextHasDb(context)) {
		throw new Error("No database in context")
	}

	return drizzle(context.DB, { schema })
}

let db: ReturnType<typeof initializeDrizzleInstance> | null = null

export function initializeDb(context: Record<string, unknown>) {
	if (!db) {
		db = initializeDrizzleInstance(context)
	}
}

export function getDb() {
	if (!db) {
		throw new Error("DB not initialized")
	}

	return db
}
