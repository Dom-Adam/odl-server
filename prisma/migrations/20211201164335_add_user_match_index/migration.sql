/*
  Warnings:

  - You are about to drop the `_MatchToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_MatchToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MatchesOnPlayers" (
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,

    PRIMARY KEY ("matchId", "playerId"),
    CONSTRAINT "MatchesOnPlayers_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchesOnPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
