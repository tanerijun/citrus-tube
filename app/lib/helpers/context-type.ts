export function contextHasSecret(
	context: Record<string, unknown>,
): context is { SECRET_KEY: string } {
	return "SECRET_KEY" in context
}

export function contextHasDb(context: Record<string, unknown>): context is { DB: D1Database } {
	return "DB" in context
}
