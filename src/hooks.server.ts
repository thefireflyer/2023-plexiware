import db from '$lib/db/db';
import { getSession } from '$lib/db/user';
import { slog } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

////////////////////////////////////////////////////////////////////////////////

export async function init() {
	// initialize database?
}

////////////////////////////////////////////////////////////////////////////////

export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/account')) {
		const sessionid = event.cookies.get('sessionid');
		const sessionauth = event.cookies.get('sessionauth');
		const result = await getSession(sessionid, sessionauth);

		await result.either(
			async (err) => {
				if (err === 'Anon') {
					slog('src/hooks.server.ts', 'handle/account', 'not logged in');
				} else {
					slog('src/hooks.server.ts', 'handle/account', 'invalid session');
					event.cookies.delete('sessionid', { path: '/' });
					event.cookies.delete('sessionauth', { path: '/' });
				}
			},
			async (session) => {
				// slog('src/hooks.server.ts', 'handle/account', 'logged in as', session);
				event.locals.session = session;
			}
		);
	} else if (event.url.pathname.startsWith('/admin')) {
		const id_ = event.cookies.get('admin-session') ?? redirect(302, '/login-admin');
		const id = parseInt(id_);
		const session = await db.adminSession.findUnique({
			where: {
				id
			}
		});

		if (session === null) {
			event.cookies.delete('admin-session', { path: '/' });
			redirect(302, '/login-admin');
		}
	}

	const response = await resolve(event);
	return response;
}

////////////////////////////////////////////////////////////////////////////////
