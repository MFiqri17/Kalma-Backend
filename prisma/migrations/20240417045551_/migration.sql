/*
  Warnings:

  - Added the required column `created_at_formatted` to the `Articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modified_at_formatted` to the `Articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at_formatted` to the `Journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at_formatted` to the `MusicMeditations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at_formatted` to the `Screenings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at_formatted` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "created_at_formatted" TEXT NOT NULL,
ADD COLUMN     "modified_at_formatted" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Journals" ADD COLUMN     "created_at_formatted" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MusicMeditations" ADD COLUMN     "created_at_formatted" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Screenings" ADD COLUMN     "created_at_formatted" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "created_at_formatted" TEXT NOT NULL,
ADD COLUMN     "last_logged_in_formatted" TEXT;
