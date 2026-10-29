CREATE TABLE `movements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text NOT NULL,
	`amount` real NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`date` text NOT NULL,
	`created_at` text NOT NULL
);
