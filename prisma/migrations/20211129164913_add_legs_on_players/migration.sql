-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LegsOnPlayers" (
    "legId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 501,

    PRIMARY KEY ("legId", "playerId"),
    CONSTRAINT "LegsOnPlayers_legId_fkey" FOREIGN KEY ("legId") REFERENCES "Leg" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LegsOnPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LegsOnPlayers" ("legId", "playerId", "points") SELECT "legId", "playerId", "points" FROM "LegsOnPlayers";
DROP TABLE "LegsOnPlayers";
ALTER TABLE "new_LegsOnPlayers" RENAME TO "LegsOnPlayers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
