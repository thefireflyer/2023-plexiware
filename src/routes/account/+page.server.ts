import type { PrismaClient, Session } from '@prisma/client';
import db from '../../lib/db/db';
import type { PageServerLoad } from './$types';
import { withSession, createUserSession, logout } from '$lib/api/user';
import bcrypt from 'bcrypt';
import { error, json } from '@sveltejs/kit';
import { slog } from '$lib/utils';
import { SALT_ROUNDS } from '$lib/db/user';
import { getRequestEvent } from '$app/server';

export const load = (async ({ cookies }) => {
	return await withSession(cookies, async (session: Session) => {
		const user = await db.user.findUnique({
			where: {
				id: session.userId
			},
			include: {
				sessions: true,
				themes: true
			}
		});

		if (user) {
			return {
				currentTheme: session.themeId,
				sessionid: session.id,
				address: user.address,
				email: user.email,
				name: user.name,
				sessions: user.sessions,
				themes: user.themes,
				profilePicture: user.profilePictureId
			};
		} else {
			error(500, 'src/routes/account/+page.server.ts: user should never be undefined.');
		}
	});
}) satisfies PageServerLoad;

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();

		const email = data.get('email') as string | null;
		const password = data.get('password') as string | null;

		if (email && password) {
			const user = await db.user.findUnique({
				where: {
					email
				}
			});

			slog('src/routes/account/+page.server.ts', 'actions/login', 'user', user);
			if (user && (await bcrypt.compare(password, user.passwordHash))) {
				return createUserSession(data, request, cookies, user, db);
			} else {
				slog('src/routes/account/+page.server.ts', 'actions/login', 'invalid cred');
				return {
					success: false
				};
			}
		} else {
			slog('src/routes/account/+page.server.ts', 'actions/login', 'invalid login');
			return {
				success: false
			};
		}
	},
	register: async ({ cookies, request }) => {
		slog('src/routes/account/+page.server.ts', 'actions/register', 'attempting new registration');

		const data = await request.formData();

		const address = data.get('address') as string | null;
		const name = data.get('name') as string | null;

		const email = data.get('email') as string | null;
		const password = data.get('password') as string | null;

		if (address && email && password) {
			const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

			const user = await db.user.create({
				data: {
					address,
					name,
					email,
					passwordHash
				}
			});

			console.log(user);

			return createUserSession(data, request, cookies, user, db);
		} else {
			return {
				success: false
			};
		}
	},
	edit: async ({ request, cookies }) => {
		const data = await request.formData();

		const address = data.get('address') as string | null;
		const name = data.get('name') as string;

		const email = data.get('email') as string | null;
		const password = data.get('password') as string | null;

		if (email && password && address) {
			return await withSession(cookies, async (session: Session) => {
				const passwordHash = await bcrypt.hash(password, 10);

				const res = await db.user.update({
					where: {
						id: session.userId
					},
					data: {
						address,
						name,
						email,
						passwordHash
					}
				});

				return { success: true };
			});
		} else {
			return {
				success: false
			};
		}
	},
	delete: async ({ cookies }) => {
		return await withSession(cookies, async (session: Session) => {
			const res = await db.user.delete({
				where: {
					id: session.userId
				}
			});

			logout(cookies);
			return {};
		});
	},
	logout: async ({ cookies }) => {
		return await withSession(cookies, async (session: Session) => {
			const res = await db.session.delete({
				where: {
					id: session.id
				}
			});

			logout(cookies);
			return {};
		});
	},
	deletesession: async ({ request, cookies }) => {
		const data = await request.formData();

		const sessionid = parseInt(data.get('sessionid') as string);
		return await withSession(cookies, async (session: Session) => {
			const res = await db.session.delete({
				where: {
					id: sessionid
				}
			});

			if (sessionid == session.id) {
				logout(cookies);
			}

			return {};
		});
	},
	removepfp: async ({ request, cookies }) => {
		return await withSession(cookies, async (session: Session) => {
			const res = await db.user.update({
				where: {
					id: session.userId
				},
				data: {
					profilePictureId: null
				}
			});

			return { success: true };
		});
	}
};
