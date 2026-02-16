/*
  Warnings:

  - You are about to drop the `recipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "recipe";

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minimum" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "unit_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "instruction" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientRecipe" (
    "id" TEXT NOT NULL,
    "ingredient_id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IngredientRecipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientRecipe" ADD CONSTRAINT "IngredientRecipe_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientRecipe" ADD CONSTRAINT "IngredientRecipe_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
