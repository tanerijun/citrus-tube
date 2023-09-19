/* eslint-disable @typescript-eslint/consistent-type-imports */

interface ServiceWorkerGlobalScope {
	auth: import("~/lib/auth.server").Auth
	db: import("~/lib/db.server").Drizzle
}
