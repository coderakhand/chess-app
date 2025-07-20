-- CreateEnum
CREATE TYPE "ThemeMode" AS ENUM ('DARK', 'LIGHT');

-- CreateEnum
CREATE TYPE "BoardTheme" AS ENUM ('DREAM_BLUE', 'CLASSIC_GREEN', 'WOOD', 'MARBLE', 'BREAD_BROWN');

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "boardTheme" "BoardTheme" NOT NULL DEFAULT 'CLASSIC_GREEN',
ADD COLUMN     "showBoardCoordinates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showValidMoves" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "themeMode" "ThemeMode" NOT NULL DEFAULT 'DARK';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "peakBlitzRating" INTEGER NOT NULL DEFAULT 800,
ADD COLUMN     "peakBulletRating" INTEGER NOT NULL DEFAULT 800,
ADD COLUMN     "peakRapidRating" INTEGER NOT NULL DEFAULT 800;

-- CreateTable
CREATE TABLE "_UserFriends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFriends_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserFriends_B_index" ON "_UserFriends"("B");

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
