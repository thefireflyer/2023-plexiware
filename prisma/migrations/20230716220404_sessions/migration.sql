-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expirationDate" DATETIME NOT NULL,
    "notesPermission" BOOLEAN NOT NULL,
    "photosPermission" BOOLEAN NOT NULL,
    "contactsPermission" BOOLEAN NOT NULL,
    "filesPermission" BOOLEAN NOT NULL,
    "rootPermission" BOOLEAN NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
