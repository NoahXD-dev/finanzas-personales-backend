CREATE TABLE `movement_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`movement_id` integer NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`subcategory` text NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`movement_id`) REFERENCES `movements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `movement_items_movement_id_idx` ON `movement_items` (`movement_id`);