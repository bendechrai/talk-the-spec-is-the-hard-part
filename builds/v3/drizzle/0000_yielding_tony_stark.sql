CREATE TABLE `placements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`talk_id` text NOT NULL,
	`slot_id` text NOT NULL,
	`room_id` text NOT NULL,
	FOREIGN KEY (`talk_id`) REFERENCES `talks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `placements_talk_id_unique` ON `placements` (`talk_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `placements_room_id_slot_id_unique` ON `placements` (`room_id`,`slot_id`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`capacity` integer NOT NULL,
	`wing` text
);
--> statement-breakpoint
CREATE TABLE `slots` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`kind` text NOT NULL,
	`label` text
);
--> statement-breakpoint
CREATE TABLE `speakers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `talk_speakers` (
	`talk_id` text NOT NULL,
	`speaker_id` text NOT NULL,
	PRIMARY KEY(`talk_id`, `speaker_id`),
	FOREIGN KEY (`talk_id`) REFERENCES `talks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`speaker_id`) REFERENCES `speakers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `talks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`length_minutes` integer NOT NULL,
	`track` text NOT NULL,
	`expected_audience` integer NOT NULL
);
