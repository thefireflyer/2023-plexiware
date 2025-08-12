import { WithSession } from '$lib/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ({ params, cookies }) => {
    const id = parseInt(params.id)

    if (id) {
        return await WithSession(cookies, async (db: PrismaClient, session: Session) => {


            const file = await db.file.findUnique({
                where: {
                    id
                }
            })
            if (file) {
                return new Response(file.preview ?? file.content)
            } else { return new Response() }
        })
    } else { return new Response() }
};