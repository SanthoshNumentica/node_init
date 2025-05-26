/*
  Warnings:

  - You are about to drop the column `desgination` on the `role` table. All the data in the column will be lost.
  - Added the required column `designation` to the `role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `role` DROP COLUMN `desgination`,
    ADD COLUMN `designation` VARCHAR(191) NOT NULL;
