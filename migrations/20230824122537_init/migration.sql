/*
  Warnings:

  - You are about to drop the column `listId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `List` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `completed` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_listId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "listId",
ADD COLUMN     "completed" BOOLEAN NOT NULL,
ADD COLUMN     "userAccessToken" TEXT;

-- DropTable
DROP TABLE "List";
