CREATE TABLE `days` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`day_start` text NOT NULL,
	`day_end` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `placements` (
	`id` text PRIMARY KEY NOT NULL,
	`talk_id` text NOT NULL,
	`room_id` text NOT NULL,
	`slot_id` text NOT NULL,
	FOREIGN KEY (`talk_id`) REFERENCES `talks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`capacity` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slots` (
	`id` text PRIMARY KEY NOT NULL,
	`day_id` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`kind` text NOT NULL,
	`label` text,
	FOREIGN KEY (`day_id`) REFERENCES `days`(`id`) ON UPDATE no action ON DELETE cascade
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
	FOREIGN KEY (`talk_id`) REFERENCES `talks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`speaker_id`) REFERENCES `speakers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `talks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`length_minutes` integer NOT NULL,
	`track` text NOT NULL,
	`expected_audience` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `days_date_unique` ON `days` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `placements_talk_id_unique` ON `placements` (`talk_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `placements_room_id_slot_id_unique` ON `placements` (`room_id`,`slot_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_name_unique` ON `rooms` (`name`);