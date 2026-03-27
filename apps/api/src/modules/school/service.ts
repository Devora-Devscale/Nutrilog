import { prisma } from "../../utils/prisma.js";

export const getSchools = async () => {
	return await prisma.school.findMany();
};
