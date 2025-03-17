/*
  Warnings:

  - You are about to drop the column `firebaseId` on the `User` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_firebaseId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firebaseId",
ADD COLUMN     "password" TEXT,
ALTER COLUMN "name" SET NOT NULL;
