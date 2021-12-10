/*
  Warnings:

  - You are about to drop the column `player1Points` on the `Leg` table. All the data in the column will be lost.
  - You are about to drop the column `player2Points` on the `Leg` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Leg` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "LegsOnPlayers" (
    "legId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    PRIMARY KEY ("legId", "playerId"),
    CONSTRAINT "LegsOnPlayers_legId_fkey" FOREIGN KEY ("legId") REFERENCES "Leg" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LegsOnPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Leg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    CONSTRAINT "Leg_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Leg" ("id", "matchId") SELECT "id", "matchId" FROM "Leg";
DROP TABLE "Leg";
ALTER TABLE "new_Leg" RENAME TO "Leg";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
