-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "throwing" INTEGER NOT NULL DEFAULT 2,
    "isFinished" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Match" ("id", "throwing") SELECT "id", "throwing" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
