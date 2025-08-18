import { withSession } from '$lib/api/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import db from '$lib/db/db';

export const load = (async ({ params, request, cookies }) => {
	const id = parseInt(params.id);
	console.log(id);

	return await withSession(cookies, async (session: Session) => {
		const event = await db.event.findUnique({
			where: {
				id
			}
		});

		if (event) {
			return {
				sessionid: session.id,
				event
			};
		} else {
			error(404, 'event not found');
		}
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

				console.log(event);

				return {
					sessionid: session.id,
					event
				};
			});
		} else {
			console.log('invalid form event create');
		}
	}
};
