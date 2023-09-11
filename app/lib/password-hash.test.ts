import { test, expect } from "bun:test"
import { hash, verify } from "./password-hash"

test("hashing and verifying", async () => {
	const password = "password"

	const hashedPassword = await hash({ password })

	expect(hashedPassword).not.toEqual(password)

	const invalidPassword = "invalid"

	let isValidPassword = await verify({ password: invalidPassword, hash: hashedPassword })

	expect(isValidPassword).toEqual(false)

	isValidPassword = await verify({ password, hash: hashedPassword })

	expect(isValidPassword).toEqual(true)
})
