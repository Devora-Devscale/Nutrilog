-- CreateTable
CREATE TABLE "IngredientTransaction" (
    "id" TEXT NOT NULL,
    "out" INTEGER NOT NULL,
    "in" INTEGER NOT NULL,
    "current_stock" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ingredient_id" TEXT NOT NULL,

    CONSTRAINT "IngredientTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IngredientTransaction" ADD CONSTRAINT "IngredientTransaction_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
