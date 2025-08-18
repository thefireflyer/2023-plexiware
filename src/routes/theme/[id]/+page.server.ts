import { withSession } from '$lib/api/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';
import db from '$lib/db/db';

export const load = (async ({ params, request, cookies }) => {
	const id = parseInt(params.id);
	console.log(id);

	return await withSession(cookies, async (session: Session) => {
		if (Number.isNaN(id)) {
			return {
				sessionid: session.id
			};
		} else {
			const theme = await db.theme.findUnique({
				where: {
					id
				}
			});

			console.log(theme);

			return {
				sessionid: session.id,
				theme
			};
		}
	});
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ params, request, cookies }) => {
		const data = await request.formData();

		const id = data.get('id') as string;
		const name = data.get('name') as string | null;
		const contents = data.get('css') as string | null;

		if (id && name && contents) {
			return await withSession(cookies, async (session: Session) => {
				const theme = await db.theme.upsert({
					where: {
						id: parseInt(id)
					},
					create: {
						name,
						contents,
						authorId: session.userId
					},
					update: {
						name,
						contents
					}
				});

				console.log(theme);

				return {
					sessionid: session.id,
					theme
				};
			});
		} else {
			console.log('invalid form event create');
		}
	}
};
