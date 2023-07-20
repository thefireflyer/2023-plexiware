import { WithSession } from '$lib/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

        const user = await db.user.findUnique({
            where: {
                id: session.userId
            }
        })


        return {
            sessionid: session.id
        }
    })

}) satisfies PageServerLoad;