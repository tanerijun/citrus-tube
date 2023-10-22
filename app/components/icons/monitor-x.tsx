import type { SVGProps } from "react"

export function MonitorXIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			>
				<path d="m14.5 12.5l-5-5m0 5l5-5"></path>
				<rect width="20" height="14" x="2" y="3" rx="2"></rect>
				<path d="M12 17v4m-4 0h8"></path>
			</g>
		</svg>
	)
}
