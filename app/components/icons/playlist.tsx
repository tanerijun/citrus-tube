import type { SVGProps } from "react"

export function PlaylistIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M12 12H3m13-6H3m9 12H3m13-6l5 3l-5 3v-6Z"
			></path>
		</svg>
	)
}
