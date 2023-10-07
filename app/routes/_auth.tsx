import { Outlet } from "@remix-run/react"
import { AutoAnimateContainer } from "~/components/ui/auto-animate-container"

export default function AuthLayout() {
	return (
		<AutoAnimateContainer asChild>
			<main className="mx-6 flex h-screen items-center justify-center">
				<Outlet />
			</main>
		</AutoAnimateContainer>
	)
}
