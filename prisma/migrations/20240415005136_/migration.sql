/*
  Warnings:

  - You are about to drop the column `axiety_status` on the `Screenings` table. All the data in the column will be lost.
  - Added the required column `anxiety_status` to the `Screenings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screenings" DROP COLUMN "axiety_status",
ADD COLUMN     "anxiety_status" TEXT NOT NULL;
