/*
  Warnings:

  - You are about to drop the column `score` on the `Visit` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Dart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL,
    "field" INTEGER NOT NULL,
    "segment" INTEGER NOT NULL,
    "visitId" TEXT NOT NULL,
    CONSTRAINT "Dart_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Visit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "legId" TEXT NOT NULL,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Visit_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Visit_legId_fkey" FOREIGN KEY ("legId") REFERENCES "Leg" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Visit" ("id", "legId", "playerId") SELECT "id", "legId", "playerId" FROM "Visit";
DROP TABLE "Visit";
ALTER TABLE "new_Visit" RENAME TO "Visit";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
