import { hc } from "hono/client";
import type { BackendType } from "../../../api/src/index";

const backend_url = import.meta.env.VITE_API_URL as string;
export const api = hc<BackendType>(backend_url, {
	init: {
		credentials: "include",
	},
});
