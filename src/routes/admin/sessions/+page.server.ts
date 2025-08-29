import db from '$lib/db/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	return {
		sessionid: parseInt(cookies.get('admin-session') ?? ''),
		sessions: await db.adminSession.findMany({
			orderBy: {
				expirationDate: 'asc'
			}
		})
	};
}) satisfies PageServerLoad;

export const actions = {
	deletesession: async ({ request, cookies }) => {
		const data = await request.formData();

		const sessionid = parseInt(data.get('sessionid') as string);

		await db.adminSession.delete({
			where: {
				id: sessionid
			}
		});

		if (sessionid == parseInt(cookies.get('admin-session') ?? '')) {
			cookies.delete('admin-session', { path: '/' });
			redirect(303, 'admin-login');
		}
	},
	logout: async ({ cookies }) => {
		const sessionid = parseInt(cookies.get('admin-session') ?? '');
		await db.adminSession.delete({
			where: {
				id: sessionid
			}
		});
		cookies.delete('admin-session', { path: '/' });
		redirect(303, 'admin-login');
	}
};
