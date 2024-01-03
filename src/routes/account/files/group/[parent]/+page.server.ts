import { WithSession } from '$lib/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ params, request, cookies }) => {
    const id = parseInt(params.parent)
    console.log(id)

    return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

        const parent = await db.folder.findUnique({
            where: {
                id
            }
        })

        console.log(parent)

        return {
            sessionid: session.id,
            parent
        }
    })

}) satisfies PageServerLoad;