CREATE TABLE `user_like_video` (
	`user_id` integer NOT NULL,
	`video_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `video`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `video_view` (
	`id` integer PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `video`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_user_like_video_user_id_video_id` ON `user_like_video` (`user_id`,`video_id`);--> statement-breakpoint
CREATE INDEX `idx_user_like_video_video_id` ON `user_like_video` (`video_id`);