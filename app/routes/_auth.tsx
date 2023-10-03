import { Outlet } from "@remix-run/react"
import { AutoAnimatedContainer } from "~/components/ui/auto-animated-container"

export default function AuthLayout() {
	return (
		<AutoAnimatedContainer asChild>
			<main className="mx-6 flex h-screen items-center justify-center">
				<Outlet />
			</main>
		</AutoAnimatedContainer>
	)
}
