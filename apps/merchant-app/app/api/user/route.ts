import { NextResponse } from "next/server"
import { PrismaClient } from "../../../../../packages/db/src";

const client = new PrismaClient();

export const GET = async () => {
    await client.user.create({
        data: {
            email: "asd",
            name: "adsads",
            password:"123456789",
            number:"1234567890"
        }
    })
    return NextResponse.json({
        message: "hi there"
    })
}