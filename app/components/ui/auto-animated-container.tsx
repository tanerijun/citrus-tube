import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import autoAnimate from "@formkit/auto-animate"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	asChild?: boolean
}

const AutoAnimatedContainer = React.forwardRef<HTMLDivElement, Props>(
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
AutoAnimatedContainer.displayName = "AutoAnimatedContainer"

export { AutoAnimatedContainer }
