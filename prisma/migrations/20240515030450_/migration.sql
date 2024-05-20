/*
  Warnings:

  - You are about to drop the column `link` on the `MusicMeditations` table. All the data in the column will be lost.
  - Added the required column `title` to the `Journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `music_link` to the `MusicMeditations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar_link` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Journals" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MusicMeditations" DROP COLUMN "link",
ADD COLUMN     "music_link" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "avatar_link" TEXT NOT NULL;
