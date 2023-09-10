import type { V2_MetaFunction } from "@remix-run/node"
import { db } from "~/lib/db/client.server"
import { users } from "~/lib/db/schema.server"

export const meta: V2_MetaFunction = () => {
	return [
		{ title: "CitrusTube" },
		{
			name: "description",
			content: "A citrus-flavored video sharing platform inspired by Youtube",
		},
	]
}

export const loader = async () => {
	// Testing DB
	// db.insert(users).values({ username: "Yes", email: "yes@gmail.com", password: "yesyesyes" }).run()

	// const allUsers = db.select().from(users).all()
	// console.log(allUsers)
	return null
}

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1 className="text-red-500 underline">Hello World!</h1>
		</div>
	)
}
