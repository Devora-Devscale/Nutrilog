export interface JwtPayload {
	sub: string;
	role?: string;
	exp: number;
}

// context for hono
export interface HonoContext {
	Variables: {
		user: {
			id: string;
			email: string;
			role: string;
			school_id: string;
		};
	};
}
