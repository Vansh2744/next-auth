import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const currUser = await currentUser();

        if (!currUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const email = currUser.emailAddresses[0].emailAddress;

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                product: true
            }
        })

        return NextResponse.json({ orders }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}