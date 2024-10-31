/*
  Warnings:

  - Added the required column `type` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Made the column `transcriptId` on table `Chat` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('QUESTION', 'ANSWER');

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_transcriptId_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "type" "ChatType" NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "transcriptId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE CASCADE ON UPDATE CASCADE;
