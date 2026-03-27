import type { LogCreateInput } from "../../generated/prisma/models.js";
import { prisma } from "../../utils/prisma.js";

export const getLogs = async () => {
	return await prisma.log.findMany();
};

export const createLog = async (data: LogCreateInput) => {
	return await prisma.log.create({
		data,
	});
};
