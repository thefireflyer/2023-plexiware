import bcrypt from 'bcrypt';
import type { PrismaClient, Session, User } from '@prisma/client';
import type { Cookies } from '@sveltejs/kit';
import db from '../db/db';
import { Left, Right, slog, type Either, type Either_ } from '../utils';
import { AUTH_TOKEN, getSession, newSession, type AuthError } from '$lib/db/user';
import { getRequestEvent } from '$app/server';

////////////////////////////////////////////////////////////////////////////////

export type Query<T> = (session: Session) => Promise<T>;

export const withSession = async <T>(cookies: Cookies, query: Query<T>) => {
	const { locals } = getRequestEvent();
	const session = locals.session;
	// slog('src/lib/api/user.ts', 'withSession', session);
	if (session) {
		return await query(session);
	} else {
		return { t: 'Anon' } as T;
	}
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

	const event = getRequestEvent();
	event.locals.session = session;

	return {
		success: true
	};
};

////////////////////////////////////////////////////////////////////////////////

export const logout = async (cookies: Cookies) => {
	cookies.delete('sessionid', { path: '/' });
	cookies.delete('sessionauth', { path: '/' });
	const event = getRequestEvent();
	event.locals.session = undefined;
};

////////////////////////////////////////////////////////////////////////////////
