import { hc } from "hono/client";
import type { BackendType } from "../../../api/src/index";

<<<<<<< HEAD
export const api = hc<BackendType>(import.meta.env.BASE_URL);
=======
const backend_url = import.meta.env.VITE_API_URL as string;
export const api = hc<BackendType>(backend_url, {
	init: {
		credentials: "include",
	},
});
>>>>>>> group/main
