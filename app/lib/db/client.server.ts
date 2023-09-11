import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import Database from "better-sqlite3"
import * as schema from "./schema.server"

const sqlite = new Database("drizzle/dev.db")

export const db = drizzle(sqlite, { schema })

migrate(db, { migrationsFolder: "drizzle/migrations" })
