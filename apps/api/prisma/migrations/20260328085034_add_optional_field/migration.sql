-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_receiver_id_fkey";

-- AlterTable
ALTER TABLE "MealPlan" ALTER COLUMN "receiver_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
