/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LegsOnPlayers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MatchesOnPlayers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Leg` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "score" INTEGER NOT NULL,
    "playerId" TEXT NOT NULL,
    "legId" TEXT NOT NULL,
    CONSTRAINT "Visit_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Visit_legId_fkey" FOREIGN KEY ("legId") REFERENCES "Leg" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Match" ("id") SELECT "id" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_LegsOnPlayers" (
    "legId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 501,

    PRIMARY KEY ("legId", "playerId"),
    CONSTRAINT "LegsOnPlayers_legId_fkey" FOREIGN KEY ("legId") REFERENCES "Leg" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LegsOnPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LegsOnPlayers" ("legId", "playerId", "points") SELECT "legId", "playerId", "points" FROM "LegsOnPlayers";
DROP TABLE "LegsOnPlayers";
ALTER TABLE "new_LegsOnPlayers" RENAME TO "LegsOnPlayers";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "password", "username") SELECT "email", "id", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_MatchesOnPlayers" (
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    PRIMARY KEY ("matchId", "playerId"),
    CONSTRAINT "MatchesOnPlayers_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchesOnPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchesOnPlayers" ("index", "matchId", "playerId") SELECT "index", "matchId", "playerId" FROM "MatchesOnPlayers";
DROP TABLE "MatchesOnPlayers";
ALTER TABLE "new_MatchesOnPlayers" RENAME TO "MatchesOnPlayers";
CREATE TABLE "new_Leg" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Leg_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Leg" ("id", "isFinished", "matchId") SELECT "id", "isFinished", "matchId" FROM "Leg";
DROP TABLE "Leg";
ALTER TABLE "new_Leg" RENAME TO "Leg";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
