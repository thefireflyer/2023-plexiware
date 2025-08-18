import bcrypt from 'bcrypt';
import type { PrismaClient, Session, User } from '@prisma/client';
import type { Cookies } from '@sveltejs/kit';
import db from './db';
import { Left, Right, type Either } from '../utils';

////////////////////////////////////////////////////////////////////////////////

const SALT_ROUNDS = 10;
export const AUTH_TOKEN = 'test';
export const APP_NAME = 'Plexiware';

////////////////////////////////////////////////////////////////////////////////

export type AuthError = 'Invalid' | 'Anon';

type GetSession = (
	sessionid: string | undefined,
	sessionauth: string | undefined
) => Promise<Either<AuthError, Session>>;

type NewSession = (deviceOS: string, user: User) => Promise<Session>;

////////////////////////////////////////////////////////////////////////////////

export const getSession = (async (sessionid, sessionauth) => {
	if (sessionid && sessionauth) {
		const sessionid_ = parseInt(sessionid);
		const session = await db.session.findUnique({
			where: {
				id: sessionid_
			},
			include: {
				theme: true
			}
		});

		if (
			session &&
			(await bcrypt.compare(sessionauth, session.authToken)) &&
			session.expirationDate > new Date()
		) {
			return new Right(session);
		} else {
			return new Left('Invalid');
		}
	} else {
		return new Left('Anon');
	}
}) satisfies GetSession;

////////////////////////////////////////////////////////////////////////////////

export const newSession = (async (deviceOS, user) => {
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 7);

	return await db.session.create({
		data: {
			authToken: await bcrypt.hash(AUTH_TOKEN, 10),
			userId: user.id,
			expirationDate,
			notesPermission: true,
			photosPermission: true,
			contactsPermission: true,
			filesPermission: true,
			rootPermission: true,
			deviceOS,
			appName: APP_NAME
		}
	});
}) satisfies NewSession;

////////////////////////////////////////////////////////////////////////////////
