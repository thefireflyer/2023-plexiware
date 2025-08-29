import { ADMIN_KEY } from '$env/static/private';
import { slog } from '$lib/utils';
import db from '$lib/db/db';
import { randomInt } from 'node:crypto';
import { redirect } from '@sveltejs/kit';

export const load = ({ cookies }) => {
	const session = cookies.get('admin-session');
	if (session) {
		redirect(303, '/admin');
	}
};

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const password = data.get('password') as string | null;

		// temp. !!
		if (password === ADMIN_KEY) {
			slog('src/routes/login-admin/+page.server.ts', 'default', 'new admin session!');

			const expirationDate = new Date();
			expirationDate.setDate(expirationDate.getDate() + 7);

			const id = randomInt(281474976710655);
			const session = await db.adminSession.create({
				data: {
					id,
					expirationDate
				}
			});

			cookies.set('admin-session', session.id.toString(), {
				secure: true,
				httpOnly: true,
				sameSite: true,
				path: '/'
			});

			redirect(303, '/admin');
		}
	}
};
