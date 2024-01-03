import { WithSession } from '$lib/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load = (async ({params, cookies}) => {
    const id = parseInt(params.id)

    return await WithSession(cookies, async (db: PrismaClient, session: Session) => {


        const file = await db.file.update({
            where: {
                id
            }, 
            data: {
                dateLastAccessed: new Date()
            },
            select: {
                id: true,
                name: true,
                dateCreated: true,
                dateLastModified: true,
                dateLastAccessed: true,
                size: true,
                fileType: true,
                description: true
            }
        })

        return {
            sessionid: session.id,
            file
        }
    })    
    
}) satisfies PageServerLoad;