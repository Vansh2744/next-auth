import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "id is not available" }, { status: 401 })
        }

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

        const cart = await prisma.cartItem.create({
            data: {
                userId: user.id,
                productId: id
            }
        })

        return NextResponse.json({ message: "cart created", cart }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}