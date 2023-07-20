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

        const nextOrCurrentEvent = await db.event.findFirst({
            where: {
                authorId: session.userId,
                end: {
                    gt: new Date()
                }
            },
            orderBy: [
                {
                    start: "asc"
                }
            ]
        })
        
        const morning = new Date()
        morning.setHours(0)
        morning.setMinutes(0)
        
        const night = new Date()
        night.setHours(23)
        night.setMinutes(59)

        const todaysEvents = await db.event.findMany({
            where: {
                authorId: session.userId,
                start: {
                    lte: night
                }, end: {
                    gte: morning
                }
            },
            orderBy: {
                start: "asc"
            }
        })

        console.log(nextOrCurrentEvent)


        return {
            sessionid: session.id,
            nextOrCurrentEvent,
            todaysEvents
        }
    })

}) satisfies PageServerLoad;