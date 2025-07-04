-- DropIndex
DROP INDEX "User_rating_idx";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "blackPlayerRating" INTEGER,
ADD COLUMN     "blackUserRatingChange" INTEGER,
ADD COLUMN     "whitePlayerRating" INTEGER,
ADD COLUMN     "whiteUserRatingChange" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blitzRating" INTEGER NOT NULL DEFAULT 800,
ADD COLUMN     "bulletRating" INTEGER NOT NULL DEFAULT 800;

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "premove" BOOLEAN NOT NULL DEFAULT false,
    "autoPromoteToQueen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE INDEX "User_rating_bulletRating_blitzRating_idx" ON "User"("rating", "bulletRating", "blitzRating");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
