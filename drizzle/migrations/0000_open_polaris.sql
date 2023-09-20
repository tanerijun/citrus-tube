CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now')) NOT NULL,
	`profile_image_url` text,
	`background_image_url` text,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `user_like_video` (
	`user_id` integer NOT NULL,
	`video_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `video`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `video` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`thumbnail_url` text NOT NULL,
	`video_url` text NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `video_view` (
	`id` integer PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `video`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_user_like_video_user_id_video_id` ON `user_like_video` (`user_id`,`video_id`);--> statement-breakpoint
CREATE INDEX `idx_user_like_video_video_id` ON `user_like_video` (`video_id`);--> statement-breakpoint
CREATE INDEX `idx_video_user_id` ON `video` (`user_id`);