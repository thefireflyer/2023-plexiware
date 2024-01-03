import { WithSession } from '$lib/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

        const folders = await db.folder.findMany({
            where: {
                authorId: session.userId,
                parentId: null
            },
            orderBy: [
                {
                  dateCreated: 'desc',
                },
              ],
        })

        const files = await db.file.findMany({
            where: {
                authorId: session.userId,
                folderId: null
            },
            select: {
                id: true,
                name: true,
                dateLastAccessed: true,
                size: true,
                fileType: true,
            },
            orderBy: [
                {
                  dateCreated: 'desc',
                },
              ],
        })

        return {
            sessionid: session.id,
            folders,
            files
        }
    })

}) satisfies PageServerLoad;

export const actions = {
    pfp: async ({ request, cookies }) => {

        const data = await request.formData()

        const id = data.get('id') as string
        

        if (id) {

            return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

                const user = await db.user.update({
                    where: {
                        id: session.userId
                    },
                    data: {
                        profilePictureId: parseInt(id)
                    }
                })

                console.log(user)

                return {
                    sessionid: session.id
                }
            })
        } else {
            console.log("invalid form event create")
        }

    },
    update: async ({ params, request, cookies }) => {

        const data = await request.formData()

        const id = data.get('id') as string
        

        const name = data.get('name') as string | null
        const description = data.get('desc') as string | null


        if (id && name) {

            return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

                const file = await db.file.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        name,
                        description,
                        dateLastModified: new Date()
                    }
                })

                console.log(file)

                return {
                    sessionid: session.id
                }
            })
        } else {
            console.log("invalid form event create")
        }

    },
    delete: async ({ request, cookies }) => {

        const data = await request.formData()

        const id = data.get('id') as string

        if (id) {
            return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

                const file = await db.file.delete({
                    where: {
                        id: parseInt(id)
                    }
                })

                console.log(file)

                return { success: true }
            })
        } else {
            console.log("invalid input")
        }

    },
    create: async ({ request, cookies }) => {
        console.log("attempting upload!")
        
        
        const data = await request.formData()

        const description = data.get('desc') as string | null

        const file = data.get('file') as File

        console.log(file.name, file.type)
        
        if (file) {

            return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

                const now = new Date()

                const event = await db.file.create({
                    data: {
                        name: file.name,
                        description,
                        content: Buffer.from(await file.arrayBuffer()),
                        size: file.size,
                        fileType: file.type,
                        dateCreated: now,
                        dateLastModified: now,
                        dateLastAccessed: now,
                        authorId: session.userId
                    }
                })

                console.log(event)

                return { success: true }
            })
        } else {
            console.log("invalid form event create")
        }

    },

    group: async ({ request, cookies }) => {        
        
        const data = await request.formData()

        const name = data.get('name') as string | null
        const parent = data.get('parentid') as string | null

        if (name) {

            return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

                const now = new Date()

                const parentId = parent ? parseInt(parent) : null

                const folder = await db.folder.create({
                    data: {
                        name,
                        parentId,
                        size: 0,
                        dateCreated: now,
                        dateLastModified: now,
                        dateLastAccessed: now,
                        authorId: session.userId
                    }
                })

                console.log(folder)

                return { success: true }
            })
        } else {
            console.log("invalid form folder create")
        }

    },

    updatefolder: async ({ params, request, cookies }) => {

        const data = await request.formData()

        const id = data.get('id') as string
        

        const name = data.get('name') as string | null


        if (id && name) {

            return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

                const folder = await db.folder.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        name,
                        dateLastModified: new Date()
                    }
                })

                console.log(folder)

                return {
                    sessionid: session.id
                }
            })
        } else {
            console.log("invalid form event create")
        }

    },

    deletefolder: async ({ request, cookies }) => {

        const data = await request.formData()

        const id = data.get('id') as string

        if (id) {
            return await WithSession(cookies, async (db: PrismaClient, session: Session) => {

                const folder = await db.folder.delete({
                    where: {
                        id: parseInt(id)
                    }
                })

                console.log(folder)

                return { success: true }
            })
        } else {
            console.log("invalid input")
        }

    },
}