/*
  Warnings:

  - Added the required column `name` to the `WaitlistEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WaitlistEntry" ADD COLUMN     "name" TEXT NOT NULL;
