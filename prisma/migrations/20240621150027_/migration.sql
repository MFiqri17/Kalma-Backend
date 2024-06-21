/*
  Warnings:

  - You are about to drop the column `image_link` on the `MusicMeditations` table. All the data in the column will be lost.
  - Added the required column `music_image` to the `MusicMeditations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MusicMeditations" DROP COLUMN "image_link",
ADD COLUMN     "music_image" TEXT NOT NULL;
