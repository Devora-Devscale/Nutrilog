import { sign } from "hono/jwt";
import { env } from "./env.js";

export const createAccessToken = async (id: string) => {
	return await sign(
		{
			sub: id,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 60 * 60,
		},
		env().JWT_SECRET,
		"HS256",
	);
};
