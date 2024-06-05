/*
  Warnings:

  - You are about to drop the column `user_privacy` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "user_privacy",
ADD COLUMN     "allow_journal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false;
