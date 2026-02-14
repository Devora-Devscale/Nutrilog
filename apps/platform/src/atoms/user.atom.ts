import type { InferResponseType } from "hono";
import { atom } from "jotai";
import type { api } from "@/utils/api";

type User = InferResponseType<typeof api.auth.login.$post>["user"];
export const userAtom = atom<User | null>(null);
