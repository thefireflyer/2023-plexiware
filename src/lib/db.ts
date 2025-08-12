import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Result = Object
export type Query = (db: PrismaClient) => Promise<Result>

export const RunWithDatabase = async (query:Query) => {
    let res = query(prisma)
    return res
}
