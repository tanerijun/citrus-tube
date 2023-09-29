import type { SVGProps } from "react"

export function CitrusIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			>
				<path d="M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z"></path>
				<path d="M19.65 15.66A8 8 0 0 1 8.35 4.34M14 10l-5.5 5.5"></path>
				<path d="M14 17.85V10H6.15"></path>
			</g>
		</svg>
	)
}
