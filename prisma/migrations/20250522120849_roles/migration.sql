-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('ADMIN', 'SUPER_ADMIN', 'USER', 'UNKNOWN') NOT NULL DEFAULT 'USER';
