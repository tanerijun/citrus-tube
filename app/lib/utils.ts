import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function isSmallScreen() {
	if (typeof window !== "undefined") {
		return window.matchMedia("(max-width: 768px)").matches
	}

	return false
}
