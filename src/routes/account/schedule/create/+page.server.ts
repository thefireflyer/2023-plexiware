import { WithSession } from '$lib/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ request, cookies }) => {
    return await WithSession(cookies, async (db: PrismaClient, session: Session) => {
        return {
            sessionid: session.id
        }
    })

}) satisfies PageServerLoad;
