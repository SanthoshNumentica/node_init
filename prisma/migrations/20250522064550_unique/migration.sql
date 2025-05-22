/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `otp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `otp_phone_number_key` ON `otp`(`phone_number`);
