import type { CreateUnitInput, UpdateUnitInput } from "@nutrilog/schema";
import { prisma } from "../../utils/prisma.js";

export async function createunit(data: CreateUnitInput) {
	return prisma.unit.create({
		data,
		select: {
			id: true,
			name: true,
			created_at: true,
		},
	});
}

export async function getUnits(id?: string) {
	return prisma.unit.findMany({
		where: id ? { id } : undefined,
		select: {
			id: true,
			name: true,
			created_at: true,
		},
	});
}

export async function updateUnits(id: string, data: UpdateUnitInput) {
	return prisma.unit.update({
		where: { id },
		data,
		select: {
			id: true,
			name: true,
			created_at: true,
		},
	});
}

export async function deleteUnits(id: string) {
	return prisma.unit.delete({
		where: { id },
		select: {
			id: true,
		},
	});
}
