import { withSession } from '$lib/api/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';
import db from '$lib/db/db';
import { slog } from '$lib/utils';

export const load = (async ({ request, cookies }) => {
	return await withSession(cookies, async (session: Session) => {
		const morning = new Date();
		morning.setHours(0);
		morning.setMinutes(0);
		const night = new Date();
		night.setHours(23);
		night.setMinutes(59);

		const events = await db.event.findMany({
			where: {
				authorId: session.userId
				//     start: {
				//         lte: night
				//     }, end: {
				//         gte: morning
				//     }
			},
			orderBy: {
				start: 'asc'
			}
		});

		// slog('src/routes/account/schedule/+page.server.ts', 'load', events);

		return {
			sessionid: session.id,
			events
		};
	});
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ params, request, cookies }) => {
		const data = await request.formData();

		const id = data.get('id') as string;
		const title = data.get('name') as string | null;
		const description = data.get('desc') as string | null;

		const startText = data.get('start') as string | null;
		const endText = data.get('end') as string | null;

		if (id && title && startText && endText) {
			return await withSession(cookies, async (session: Session) => {
				const start = new Date(startText);
				const end = new Date(endText);

				const event = await db.event.update({
					where: {
						id: parseInt(id)
					},
					data: {
						title,
						description,
						start,
						end
					}
				});

				slog('src/routes/account/schedule/+page.server.ts', 'update', event);

				return {
					sessionid: session.id,
					event
				};
			});
		} else {
			slog('src/routes/account/schedule/+page.server.ts', 'load', 'invalid form event create');
		}
	},
	delete: async ({ request, cookies }) => {
		const data = await request.formData();

		const id = data.get('id') as string;

		if (id) {
			return await withSession(cookies, async (session: Session) => {
				const event = await db.event.delete({
					where: {
						id: parseInt(id)
					}
				});

				slog('src/routes/account/schedule/+page.server.ts', 'delete', event);

				return { success: true };
			});
		} else {
			slog('src/routes/account/schedule/+page.server.ts', 'delete', 'invalid input');
		}
	},
	create: async ({ request, cookies }) => {
		const data = await request.formData();

		const title = data.get('name') as string | null;
		const description = data.get('desc') as string | null;

		const startText = data.get('start') as string | null;
		const endText = data.get('end') as string | null;

		if (title && startText && endText) {
			return await withSession(cookies, async (session: Session) => {
				const start = new Date(startText);
				const end = new Date(endText);

				const event = await db.event.create({
					data: {
						title,
						description,
						start,
						end,
						authorId: session.userId
					}
				});

				slog('src/routes/account/schedule/+page.server.ts', 'create', event);

				return { success: true };
			});
		} else {
			slog('src/routes/account/schedule/+page.server.ts', 'create', 'invalid form event create');
		}
	}
};
