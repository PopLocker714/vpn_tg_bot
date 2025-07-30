CREATE TABLE `payment_data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` integer NOT NULL,
	`payment_id` text NOT NULL,
	`provider` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `admin_secrets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`encrypted_data` text NOT NULL,
	`iv` text NOT NULL,
	`auth_tag` text NOT NULL,
	`salt` text NOT NULL,
	`iterations` integer NOT NULL,
	`hash_algorithm` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `servers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`protocols` text,
	`max_keys` integer NOT NULL,
	`credentials` integer,
	FOREIGN KEY (`credentials`) REFERENCES `admin_secrets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` integer NOT NULL,
	`payment_id` integer NOT NULL,
	`type_id` integer NOT NULL,
	`closed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`payment_id`) REFERENCES `payment_data`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`type_id`) REFERENCES `subscription_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscription_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text
);
--> statement-breakpoint
CREATE TABLE `telegram_data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tg_id` integer NOT NULL,
	`first_name` text,
	`last_name` text,
	`username` text NOT NULL,
	`chat_id` integer NOT NULL,
	`owner_id` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer NOT NULL
);
