/*
  Warnings:

  - Added the required column `matchId` to the `Leg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Leg` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Leg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player1Points" INTEGER NOT NULL DEFAULT 501,
    "player2Points" INTEGER NOT NULL DEFAULT 501,
    "matchId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Leg_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Leg_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Leg" ("id", "player1Points", "player2Points") SELECT "id", "player1Points", "player2Points" FROM "Leg";
DROP TABLE "Leg";
ALTER TABLE "new_Leg" RENAME TO "Leg";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
