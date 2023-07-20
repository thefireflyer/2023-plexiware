import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Result = Object
export type Query = (db: PrismaClient) => Promise<Result>

export const RunWithDatabase = async (query:Query) => {
    let res = query(prisma)
    res.then(async () => {
        await prisma.$disconnect()
        })
        .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
        })
    return res
}
