import bcrypt from 'bcrypt';
import type { PrismaClient, Session, User } from '@prisma/client';
import type { Cookies } from '@sveltejs/kit';
import db from '../db/db';
import { Left, Right, type Either, type Either_ } from '../utils';
import { AUTH_TOKEN, getSession, newSession, type AuthError } from '$lib/db/user';

////////////////////////////////////////////////////////////////////////////////

export type Query<T> = (session: Session) => Promise<T>;

export const withSession = async <T>(cookies: Cookies, query: Query<T>) => {
	const sessionid = cookies.get('sessionid');
	const sessionauth = cookies.get('sessionauth');
	const result = await getSession(sessionid, sessionauth);

	return await result.either(
		async (err) => {
			if (err === 'Anon') {
				console.log('unauth');
				return { t: 'L', d: 'Anon' };
			} else {
				console.log('invalid session');
				cookies.delete('sessionid', { path: '/' });
				cookies.delete('sessionauth', { path: '/' });
				return { t: 'L', d: 'Invalid' };
			}
		},
		async (session) => {
			const data = await query(session);
			return { t: 'R', d: data };
		}
	);
};

////////////////////////////////////////////////////////////////////////////////

export const createUserSession = async (
	data: FormData,
	request: Request,
	cookies: Cookies,
	user: User,
	db: PrismaClient
) => {
	const deviceOS = data.get('os') as string;
	const session = await newSession(deviceOS, user);

	cookies.set('sessionid', session.id.toString(), {
		secure: false,
		path: '/'
	});
	cookies.set('sessionauth', AUTH_TOKEN, {
		secure: false,
		path: '/'
	});

	return {
		success: true
	};
};

////////////////////////////////////////////////////////////////////////////////
