CREATE TABLE `health_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`service_id` text NOT NULL,
	`status` text NOT NULL,
	`response_time` integer NOT NULL,
	`status_code` integer,
	`error` text,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`config` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`method` text DEFAULT 'GET' NOT NULL,
	`timeout` integer DEFAULT 10000 NOT NULL,
	`expected_status` integer DEFAULT 200 NOT NULL,
	`created_at` integer NOT NULL
);
