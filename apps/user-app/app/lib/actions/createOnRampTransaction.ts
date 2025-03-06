"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";


export default async function createOnRampTransaction(amount : number , provider : string){
    const session = await getServerSession(authOptions)
    const token  = Math.random().toString()
    const userId = session.user.id

    if(!userId){
        return {
            msg:"User is not logged in"
        }
    }

    await prisma.onRampTransaction.create({
        data:{
            userId: Number(userId),
            amount :amount,
            startTime: new Date(),
            provider : provider,
            status: "Processing",
            token:token

        }
    })

    return {
        msg:"On Ramp Transaction added"
    }
}