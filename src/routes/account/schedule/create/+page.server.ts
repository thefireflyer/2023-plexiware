import { withSession } from '$lib/api/user';
import type { Session } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	return await withSession(cookies, async (session: Session) => {
		return {
			sessionid: session.id
		};
	});
}) satisfies PageServerLoad;
