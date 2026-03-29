-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_recipe_id_fkey";

-- AlterTable
ALTER TABLE "MealPlan" ALTER COLUMN "recipe_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
