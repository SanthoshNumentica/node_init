-- CreateTable
CREATE TABLE `action_name` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action_name` VARCHAR(191) NOT NULL,
    `actionDes` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
