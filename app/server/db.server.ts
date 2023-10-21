import { drizzle } from "drizzle-orm/d1"
import * as schema from "./schema.server"

const initializeDrizzleInstance = (d1: D1Database) => {
	return drizzle(d1, { schema })
}

let db: ReturnType<typeof initializeDrizzleInstance> | null = null

export function initializeDb(d1: D1Database) {
	if (!db) {
		db = initializeDrizzleInstance(d1)
	}
}

export function getDb() {
	if (!db) {
		throw new Error("DB not initialized")
	}

	return db
}
