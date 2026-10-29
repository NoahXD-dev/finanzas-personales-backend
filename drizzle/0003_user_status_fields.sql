ALTER TABLE `users` ADD `status` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `inactivated_by` integer REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `users` ADD `inactivated_at` text;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` text;--> statement-breakpoint
UPDATE `users` SET `updated_at` = `created_at` WHERE `updated_at` IS NULL;
