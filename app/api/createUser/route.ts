import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "email not exist" }, { status: 401 })
        }

        const existingUser = await prisma.user.findFirst({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ message: "User already exist" }, { status: 401 })
        }

        const user = await prisma.user.create({
            data: {
                email
            }
        })

        return NextResponse.json({ message: "User created Successfully", user }, { status: 200 })
    } catch (error) {

    }
}