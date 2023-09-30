declare global {
	interface Window {
		// Environment variables passed to client
		ENV?: {
			CLOUDINARY_CLOUD_NAME?: string
		}
	}
}

export {}
