CREATE TABLE `keys` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ownerId` integer NOT NULL,
	`key` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ownerId` integer NOT NULL,
	`plan` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`expired` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `telegram_data` (
	`ownerId` integer NOT NULL,
	`id` integer NOT NULL,
	`chatId` integer NOT NULL,
	`firstName` text,
	`lastName` text,
	`username` text NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vpn_servers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`ip` text NOT NULL,
	`location` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
