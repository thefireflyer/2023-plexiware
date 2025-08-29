import { withSession } from '$lib/api/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { RequestHandler } from './$types';
import db from '$lib/db/db';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const id = parseInt(params.id);
	const result = await withSession(cookies, async (session: Session) => {
		const file = await db.file.findUnique({
			where: {
				id
			}
		});

		return file ? file.content : error(404);
	});

	// hacky, but seems to work...
	return new Response(result as any);
};
