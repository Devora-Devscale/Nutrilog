import type { Role } from "../../generated/prisma/enums.js";
import { prisma } from "../../utils/prisma.js";

export const userService = {
	getAll: async () => {
		return await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				school_id: true,
				created_at: true,
			},
		});
	},

	getById: async (id: string) => {
		return await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				school_id: true,
				created_at: true,
			},
		});
	},

	update: async (
		id: string,
		data: { name?: string; role?: Role; school_id?: string },
	) => {
		return await prisma.user.update({
			where: { id },
			data,
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				school_id: true,
				created_at: true,
			},
		});
	},

	delete: async (id: string) => {
		return await prisma.user.delete({ where: { id } });
	},
};
