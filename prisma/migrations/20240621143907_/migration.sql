/*
  Warnings:

  - Added the required column `image_link` to the `MusicMeditations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MusicMeditations" ADD COLUMN     "image_link" TEXT NOT NULL;
