import { withSession } from '$lib/api/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import db from '$lib/db/db';

export const load = (async ({ params, request, cookies }) => {
	const id = parseInt(params.parent);
	console.log(id);

	return await withSession(cookies, async (session: Session) => {
		const parent = await db.folder.findUnique({
			where: {
				id
			}
		});

		console.log(parent);

		if (parent) {
			return {
				sessionid: session.id,
				parent
			};
		} else {
			error(404, 'parent group not found');
		}
	});
}) satisfies PageServerLoad;
