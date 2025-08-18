import { withSession } from '$lib/api/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ request, cookies }) => {
	return await withSession(cookies, async (session: Session) => {
		return {
			sessionid: session.id
		};
	});
}) satisfies PageServerLoad;
