import autoAnimate from "@formkit/auto-animate"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	asChild?: boolean
}

const AutoAnimateContainer = React.forwardRef<HTMLDivElement, Props>(
	({ asChild, ...props }, forwardedRef) => {
		const Comp = asChild ? Slot : "div"

		const innerRef = React.useRef<HTMLDivElement | null>(null)

		React.useImperativeHandle(forwardedRef, () => innerRef.current!)

		React.useEffect(() => {
			innerRef.current && autoAnimate(innerRef.current)
		}, [innerRef])

		return <Comp ref={innerRef} {...props} />
	},
)
AutoAnimateContainer.displayName = "AutoAnimatedContainer"

export { AutoAnimateContainer }
