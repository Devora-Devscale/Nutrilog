import { prisma } from "../../utils/prisma.js";

export const getUser = async (id: string) => {
	return await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			email: true,
			name: true,
			school_id: true,
			role: true,
		},
	});
};
