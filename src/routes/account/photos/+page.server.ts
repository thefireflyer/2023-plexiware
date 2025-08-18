import { withSession } from '$lib/api/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';
import db from '$lib/db/db';
import { id } from '$lib/utils';

export const load = (async ({ cookies }) => {
	return await withSession(cookies, async (session: Session) => {
		const user = await db.user.findUnique({
			where: {
				id: session.userId
			}
		});

		return {
			sessionid: session.id
		};
	});
}) satisfies PageServerLoad;
