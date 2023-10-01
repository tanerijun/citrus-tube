import type { SVGProps } from "react"

export function UserSquareIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			>
				<rect width="18" height="18" x="3" y="3" rx="2"></rect>
				<circle cx="12" cy="10" r="3"></circle>
				<path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
			</g>
		</svg>
	)
}
