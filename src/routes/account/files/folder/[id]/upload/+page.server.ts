import { withSession } from '$lib/api/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';
import db from '$lib/db/db';

export const load = (async ({ cookies }) => {
	return await withSession(cookies, async (session: Session) => {
		const tags = await db.fileTag.findMany({
			where: {
				authorId: session.userId
			}
		});

		return {
			sessionid: session.id,
			tags
		};
	});
}) satisfies PageServerLoad;
