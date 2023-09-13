import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import * as schema from "./schema.server"

const sqlite = new Database("drizzle/dev.db")

export const db = drizzle(sqlite, { schema })

// Pushing to DB directly for now
// migrate(db, { migrationsFolder: "drizzle/migrations" })
