import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 401 })
        }

        const user = await prisma.user.findFirst({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({ message: "User not available for this email" }, { status: 401 })
        }
        return NextResponse.json({ user }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}