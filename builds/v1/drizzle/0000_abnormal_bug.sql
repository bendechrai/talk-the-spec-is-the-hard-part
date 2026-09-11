CREATE TABLE `assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`talk_id` text NOT NULL,
	`room_id` text NOT NULL,
	`slot_id` text NOT NULL,
	FOREIGN KEY (`talk_id`) REFERENCES `talks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assignments_talk_id_unique` ON `assignments` (`talk_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `room_slot_unique` ON `assignments` (`room_id`,`slot_id`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slots` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`label` text
);
--> statement-breakpoint
CREATE TABLE `speakers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `talks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`speaker_id` text NOT NULL,
	`length_minutes` integer NOT NULL,
	FOREIGN KEY (`speaker_id`) REFERENCES `speakers`(`id`) ON UPDATE no action ON DELETE no action
);
