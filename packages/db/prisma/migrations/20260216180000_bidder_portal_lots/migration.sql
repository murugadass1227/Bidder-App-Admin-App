-- CreateTable yards
CREATE TABLE `yards` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable auctions: add lot/vehicle and auction rule columns
ALTER TABLE `auctions` ADD COLUMN `make` VARCHAR(100) NULL;
ALTER TABLE `auctions` ADD COLUMN `model` VARCHAR(100) NULL;
ALTER TABLE `auctions` ADD COLUMN `year` INTEGER NULL;
ALTER TABLE `auctions` ADD COLUMN `vin` VARCHAR(50) NULL;
ALTER TABLE `auctions` ADD COLUMN `engine_number` VARCHAR(50) NULL;
ALTER TABLE `auctions` ADD COLUMN `mileage` INTEGER NULL;
ALTER TABLE `auctions` ADD COLUMN `accident_summary` TEXT NULL;
ALTER TABLE `auctions` ADD COLUMN `damage_notes` TEXT NULL;
ALTER TABLE `auctions` ADD COLUMN `damage_type` VARCHAR(100) NULL;
ALTER TABLE `auctions` ADD COLUMN `yard_id` VARCHAR(191) NULL;
ALTER TABLE `auctions` ADD COLUMN `yard_name` VARCHAR(191) NULL;
ALTER TABLE `auctions` ADD COLUMN `yard_location` VARCHAR(191) NULL;
ALTER TABLE `auctions` ADD COLUMN `inspection_times` TEXT NULL;
ALTER TABLE `auctions` ADD COLUMN `viewing_instructions` TEXT NULL;
ALTER TABLE `auctions` ADD COLUMN `photo_urls` TEXT NULL;
ALTER TABLE `auctions` ADD COLUMN `video_url` VARCHAR(500) NULL;
ALTER TABLE `auctions` ADD COLUMN `reserve_price` DECIMAL(12, 2) NULL;
ALTER TABLE `auctions` ADD COLUMN `bid_increment` DECIMAL(12, 2) NULL;
ALTER TABLE `auctions` ADD COLUMN `buyer_fees` DECIMAL(12, 2) NULL;
ALTER TABLE `auctions` ADD COLUMN `vat_taxes` DECIMAL(12, 2) NULL;
ALTER TABLE `auctions` ADD COLUMN `extend_minutes` INTEGER NULL;

ALTER TABLE `auctions` ADD CONSTRAINT `auctions_yard_id_fkey` FOREIGN KEY (`yard_id`) REFERENCES `yards`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX `auctions_status_idx` ON `auctions`(`status`);
CREATE INDEX `auctions_make_idx` ON `auctions`(`make`);
CREATE INDEX `auctions_year_idx` ON `auctions`(`year`);
CREATE INDEX `auctions_yard_id_idx` ON `auctions`(`yard_id`);
CREATE INDEX `auctions_damage_type_idx` ON `auctions`(`damage_type`);

-- AlterTable bids: add max_bid
ALTER TABLE `bids` ADD COLUMN `max_bid` DECIMAL(12, 2) NULL;

-- CreateTable watchlists
CREATE TABLE `watchlists` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `auction_id` VARCHAR(191) NOT NULL,
    `reminder_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `watchlists_user_id_auction_id_key`(`user_id`, `auction_id`),
    INDEX `watchlists_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable invoices
CREATE TABLE `invoices` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `auction_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `fees` DECIMAL(12, 2) NOT NULL,
    `taxes` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `invoice_number` VARCHAR(191) NOT NULL,
    `paid_at` DATETIME(3) NULL,
    `release_note_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `invoices_invoice_number_key`(`invoice_number`),
    UNIQUE INDEX `invoices_user_id_auction_id_key`(`user_id`, `auction_id`),
    INDEX `invoices_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `watchlists` ADD CONSTRAINT `watchlists_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `watchlists` ADD CONSTRAINT `watchlists_auction_id_fkey` FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_auction_id_fkey` FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
