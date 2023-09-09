import type { V2_MetaFunction } from "@remix-run/node"

export const meta: V2_MetaFunction = () => {
	return [
		{ title: "CitrusTube" },
		{
			name: "description",
			content: "A citrus-flavored video sharing platform inspired by Youtube",
		},
	]
}

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1 className="text-red-500 underline">Hello World!</h1>
		</div>
	)
}
