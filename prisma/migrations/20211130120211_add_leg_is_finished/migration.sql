-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Leg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Leg_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Leg" ("id", "matchId") SELECT "id", "matchId" FROM "Leg";
DROP TABLE "Leg";
ALTER TABLE "new_Leg" RENAME TO "Leg";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
