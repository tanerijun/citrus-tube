import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { cn } from "~/lib/utils"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	asChild?: boolean
	mount: boolean
	onMountClass: string
	onUnmountClass: string
}

const CSSAnimationContainer = React.forwardRef<HTMLDivElement, Props>(
	({ asChild, mount, onMountClass, onUnmountClass, className, ...props }, ref) => {
		const Comp = asChild ? Slot : "div"

		const [shouldRender, setShouldRender] = React.useState(mount)

		React.useEffect(() => {
			if (mount) {
				setShouldRender(true)
			}
		}, [mount])

		const handleAnimationEnd = () => {
			if (!mount) {
				setShouldRender(false)
			}
		}

		return (
			shouldRender && (
				<Comp
					ref={ref}
					className={cn(className, mount ? onMountClass : onUnmountClass)}
					onAnimationEnd={handleAnimationEnd}
					{...props}
				/>
			)
		)
	},
)
CSSAnimationContainer.displayName = "CSSAnimationContainer"

export { CSSAnimationContainer }
