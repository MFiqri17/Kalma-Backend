/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `MusicMeditations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modified_at_formatted` to the `MusicMeditations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modified_by` to the `MusicMeditations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MusicMeditations" ADD COLUMN     "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified_at_formatted" TEXT NOT NULL,
ADD COLUMN     "modified_by" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MusicMeditations_title_key" ON "MusicMeditations"("title");

-- AddForeignKey
ALTER TABLE "MusicMeditations" ADD CONSTRAINT "MusicMeditations_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
