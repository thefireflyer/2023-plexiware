-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "deviceOS" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "themeId" INTEGER,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Session_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("appName", "authToken", "contactsPermission", "deviceOS", "expirationDate", "filesPermission", "id", "notesPermission", "photosPermission", "rootPermission", "userId") SELECT "appName", "authToken", "contactsPermission", "deviceOS", "expirationDate", "filesPermission", "id", "notesPermission", "photosPermission", "rootPermission", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
