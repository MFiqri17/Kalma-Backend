/*
  Warnings:

  - You are about to drop the column `emotions` on the `Journals` table. All the data in the column will be lost.
  - Added the required column `emotion` to the `Journals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Journals" DROP COLUMN "emotions",
ADD COLUMN     "emotion" TEXT NOT NULL;
