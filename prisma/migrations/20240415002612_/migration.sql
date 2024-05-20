/*
  Warnings:

  - Added the required column `axiety_status` to the `Screenings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depression_status` to the `Screenings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stress_status` to the `Screenings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screenings" ADD COLUMN     "axiety_status" TEXT NOT NULL,
ADD COLUMN     "depression_status" TEXT NOT NULL,
ADD COLUMN     "stress_status" TEXT NOT NULL;
