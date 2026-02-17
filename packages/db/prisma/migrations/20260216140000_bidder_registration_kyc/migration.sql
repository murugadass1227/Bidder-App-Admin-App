-- CreateEnum (KycStatus)
-- MySQL: create enum type via column; we add KycStatus when we add user.kyc_status

-- CreateEnum (KycDocumentType)
-- CreateEnum (VerificationCodeType)

-- AlterTable users: add new columns (nullable for existing rows)
ALTER TABLE `users` ADD COLUMN `full_name` VARCHAR(191) NULL;
ALTER TABLE `users` ADD COLUMN `mobile` VARCHAR(191) NULL;
ALTER TABLE `users` ADD COLUMN `email_verified_at` DATETIME(3) NULL;
ALTER TABLE `users` ADD COLUMN `mobile_verified_at` DATETIME(3) NULL;
ALTER TABLE `users` ADD COLUMN `reservation_proof_url` VARCHAR(191) NULL;
ALTER TABLE `users` ADD COLUMN `reservation_proof_verified_at` DATETIME(3) NULL;
ALTER TABLE `users` ADD COLUMN `physical_address` VARCHAR(191) NULL;
ALTER TABLE `users` ADD COLUMN `preferred_payment_method` VARCHAR(191) NULL;
ALTER TABLE `users` ADD COLUMN `company_details` VARCHAR(191) NULL;
ALTER TABLE `users` ADD COLUMN `kyc_status` ENUM('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
ALTER TABLE `users` ADD COLUMN `terms_accepted_at` DATETIME(3) NULL;
ALTER TABLE `users` ADD COLUMN `privacy_accepted_at` DATETIME(3) NULL;
ALTER TABLE `users` ADD COLUMN `auction_rules_accepted_at` DATETIME(3) NULL;
ALTER TABLE `users` ADD COLUMN `as_is_disclaimer_accepted_at` DATETIME(3) NULL;
ALTER TABLE `users` ADD COLUMN `two_factor_enabled` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `users` ADD COLUMN `two_factor_secret` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `users_mobile_key` ON `users`(`mobile`);

-- CreateTable verification_codes
CREATE TABLE `verification_codes` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` ENUM('EMAIL_OTP', 'EMAIL_LINK', 'MOBILE_OTP') NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `verification_codes_user_id_type_idx`(`user_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable kyc_documents
CREATE TABLE `kyc_documents` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `document_type` ENUM('ID_COPY', 'BUSINESS_REGISTRATION') NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `rejection_reason` VARCHAR(191) NULL,
    `reviewed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kyc_documents_user_id_document_type_key`(`user_id`, `document_type`),
    INDEX `kyc_documents_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `verification_codes` ADD CONSTRAINT `verification_codes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kyc_documents` ADD CONSTRAINT `kyc_documents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
