export type { LoginInput, RegisterInput } from "./modules/auth/schema.js";
export {
	loginSchema,
	registerFESchema,
	registerSchema,
} from "./modules/auth/schema.js";
export type {
	CreateIngredientInput,
	UpdateIngredientInput,
} from "./modules/ingredient/schema.js";
export {
	createIngredientSchema,
	updateIngredientSchema,
} from "./modules/ingredient/schema.js";
export {
	createIngredientTransactionSchema,
	updateIngredientTransactionSchema,
} from "./modules/ingredient-transaction/schema.js";
export type {
	CreateRecipeInput,
	UpdateRecipeInput,
	GenerateInstructionType,
} from "./modules/recipe/schema.js";
export {
	createRecipeSchema,
	updateRecipeSchema,
	generateInstruction,
} from "./modules/recipe/schema.js";
export type {
	CreateSchoolInput,
	UpdateSchoolInput,
} from "./modules/school/school.js";
export {
	createSchoolSchema,
	updateSchoolSchema,
} from "./modules/school/school.js";
export type {
	CreateUnitInput,
	UpdateUnitInput,
} from "./modules/unit/schema.js";
export { createUnitSchema, updateUnitSchema } from "./modules/unit/schema.js";
export type { UpdateUserInput } from "./modules/user/user.js";
export { updateUserSchema } from "./modules/user/user.js";
