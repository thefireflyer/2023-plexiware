import { WithSession } from '$lib/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, cookies }) => {
    const id = parseInt(params.id)

    return await WithSession(cookies, async (db: PrismaClient, session: Session) => {


        const folder = await db.folder.update({
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
                files: {
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
                },
                folders: true,
                parentId: true,
            }
        })

        return {
            sessionid: session.id,
            folder
        }
    })

}) satisfies PageServerLoad;


export const actions = {
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
    create: async ({ params, request, cookies }) => {
        console.log("attempting upload!")


        const folderId = parseInt(params.id)
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
                        folderId,
                        authorId: session.userId
                    }
                })


                async function updateSizes(id: number) {
                    console.log("parent", id)
                    const folder = await db.folder.update({
                        where: {
                            id
                        },
                        data: {
                            size: {
                                increment: file.size,
                            },
                        },
                        include: {
                            parent: true
                        }
                    })
                    if (folder.parentId != null) {
                        updateSizes(folder.parentId)
                    }
                }
                updateSizes(folderId)

                console.log(event)

                return { success: true }
            })
        } else {
            console.log("invalid form event create")
        }

    },
}