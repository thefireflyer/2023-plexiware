-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("authorId", "content", "id", "published", "title") SELECT "authorId", "content", "id", "published", "title" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expirationDate" DATETIME NOT NULL,
    "notesPermission" BOOLEAN NOT NULL,
    "photosPermission" BOOLEAN NOT NULL,
    "contactsPermission" BOOLEAN NOT NULL,
    "filesPermission" BOOLEAN NOT NULL,
    "rootPermission" BOOLEAN NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("authToken", "contactsPermission", "expirationDate", "filesPermission", "id", "notesPermission", "photosPermission", "rootPermission", "userId") SELECT "authToken", "contactsPermission", "expirationDate", "filesPermission", "id", "notesPermission", "photosPermission", "rootPermission", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
