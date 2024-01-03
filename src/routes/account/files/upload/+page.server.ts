import { WithSession } from '$lib/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

        const tags = await db.fileTag.findMany({
            where: {
                authorId: session.userId
            }
        })


        return {
            sessionid: session.id,
            tags
        }
    })

}) satisfies PageServerLoad;