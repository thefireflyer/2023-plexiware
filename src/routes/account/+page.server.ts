import type { PrismaClient, Session } from '@prisma/client';
import { RunWithDatabase } from '../../lib/db';
import type { PageServerLoad } from './$types';
import { WithSession, createUserSession } from '$lib/user';

import bcrypt from "bcrypt";

export const load = (async ({ cookies }) => {
    return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

        const user = await db.user.findUnique({
            where: {
                id: session.userId
            },
            include: {
                sessions: true,
                themes: true
            }
        })


        return {
            currentTheme: session.themeId,
            sessionid: session.id,
            address: user?.address,
            email: user?.email,
            name: user?.name,
            sessions: user?.sessions,
            themes: user?.themes,
            profilePicture: user?.profilePictureId
        }
    })

}) satisfies PageServerLoad;

export const actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData()

        const email = data.get('email') as string | null
        const password = data.get('password') as string | null

        if (email && password) {

            return await RunWithDatabase(async (db: PrismaClient) => {

                const user = await db.user.findUnique({
                    where: {
                        email
                    }
                })

                if (user && await bcrypt.compare(password, user.passwordHash)) {
                    console.log(user)
                    return createUserSession(data, request, cookies, user, db)
                }

                else {
                    console.log("invalid cred")
                    return {
                        success: false
                    }
                }

            })
        }
        else {
            console.log("invalid login")
            return {
                success: false
            }
        }
    },
    register: async ({ cookies, request }) => {

        console.log("register!!")

        const data = await request.formData()

        const address = data.get('address') as string | null
        const name = data.get('name') as string | null

        const email = data.get('email') as string | null
        const password = data.get('password') as string | null

        if (address && email && password) {
            return await RunWithDatabase(async (db: PrismaClient) => {
                const passwordHash = await bcrypt.hash(password, 10)

                const user = await db.user.create({

                    data: {
                        address,
                        name,
                        email,
                        passwordHash
                    },

                })

                console.log(user)

                return createUserSession(data, request, cookies, user, db)
            })
        }
        else {
            return {
                success: false
            }
        }
    },
    edit: async ({ request, cookies }) => {

        const data = await request.formData()

        const address = data.get('address') as string | null
        const name = data.get('name') as string

        const email = data.get('email') as string | null
        const password = data.get('password') as string | null

        if (email && password && address) {
            return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

                const passwordHash = await bcrypt.hash(password, 10)

                const res = await db.user.update({
                    where: {
                        id: session.userId
                    },
                    data: {
                        address,
                        name,
                        email,
                        passwordHash
                    }
                })


                return { success: true }
            })
        }
        else {
            return {
                success: false
            }
        }
    },
    delete: async ({ cookies }) => {

        return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

            const res = await db.user.delete({
                where: {
                    id: session.userId
                }
            })


            cookies.delete('sessionid', {path: '/'})
            cookies.delete('sessionauth', {path: '/'})

            return {}
        })
    },
    logout: async ({ cookies }) => {

        return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

            const res = await db.session.delete({
                where: {
                    id: session.id
                }
            })


            cookies.delete('sessionid', {path: '/'})
            cookies.delete('sessionauth', {path: '/'})

            return {}
        })
    },
    deletesession: async ({ request, cookies }) => {

        const data = await request.formData()

        const sessionid = parseInt(data.get('sessionid') as string)
        return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

            const res = await db.session.delete({
                where: {
                    id: sessionid
                }
            })

            if (sessionid == session.id) {
                cookies.delete('sessionid', {path: '/'})
                cookies.delete('sessionauth', {path: '/'})
            }


            return {}
        })
    },
    removepfp: async ({ request, cookies }) => {

        return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

            const res = await db.user.update({
                where: {
                    id: session.userId
                },
                data: {
                    profilePictureId: null
                }
            })


            return { success: true }
        })
    }
};