-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_school_id_fkey";

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
