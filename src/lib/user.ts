import bcrypt from "bcrypt";
import { RunWithDatabase } from "./db";
import type { PrismaClient, Session, User } from "@prisma/client";
import type { Cookies } from "@sveltejs/kit";

const saltRounds = 10;

export enum AuthErrors {
    Anon,
    Invalid,
}

export type Query = (db: PrismaClient, session: Session) => Promise<Object>

export const WithSession = async (cookies: Cookies, query: Query) => {

    const sessionid = parseInt(cookies.get('sessionid') || "" );
    const sessionauth = cookies.get('sessionauth');

    if (sessionauth) {

        return await RunWithDatabase(async (db: PrismaClient) => {
    
            const session = await db.session.findUnique({
                where: {
                    id: sessionid
                }
            })

            if (session && await bcrypt.compare(sessionauth, session.authToken) && session.expirationDate > new Date()) {
                return await query(db, session)
            }
            else {

                cookies.delete('sessionid')
                cookies.delete('sessionauth')
                return {}
            }

        })

    }
    else {
        return {}
    }

}

export const createUserSession = async (data: FormData, request: Request, cookies: Cookies, 
    user: User, db: PrismaClient) => {

    const deviceOS = data.get('os') as string
    
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate()+7)

    const authToken = "test"

    const session = await db.session.create({
        data: {
            authToken: await bcrypt.hash(authToken, 10),
            userId: user.id,
            expirationDate,
            notesPermission: true,
            photosPermission: true,
            contactsPermission: true,
            filesPermission: true,
            rootPermission: true,
            deviceOS,
            appName: "test.2"
        }
    })

    cookies.set('sessionid', session.id.toString());
    cookies.set('sessionauth', authToken);


    return {
        success: true
    }

}