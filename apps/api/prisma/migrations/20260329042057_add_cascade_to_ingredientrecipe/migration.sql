-- DropForeignKey
ALTER TABLE "IngredientRecipe" DROP CONSTRAINT "IngredientRecipe_recipe_id_fkey";

-- AddForeignKey
ALTER TABLE "IngredientRecipe" ADD CONSTRAINT "IngredientRecipe_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
