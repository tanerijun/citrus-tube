CREATE TABLE `user_follow_user` (
	`follower` integer NOT NULL,
	`following` integer NOT NULL,
	FOREIGN KEY (`follower`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`following`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_user_follow_user_follower` ON `user_follow_user` (`follower`);--> statement-breakpoint
CREATE INDEX `idx_user_follow_user_following` ON `user_follow_user` (`following`);