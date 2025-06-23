-- AlterEnum
ALTER TYPE "TimeControl" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "baseTime" INTEGER,
ADD COLUMN     "increment" INTEGER,
ALTER COLUMN "timeControl" DROP NOT NULL;
