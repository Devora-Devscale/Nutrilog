import type { BackendType } from "@nutrilog/api";
import { hc } from "hono/client";

const backend_url = import.meta.env.VITE_API_URL as string;

export const api = hc<BackendType>(backend_url, {
	init: {
		credentials: "include",
	},
});
