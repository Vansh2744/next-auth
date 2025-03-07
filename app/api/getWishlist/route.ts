import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const currUser = await currentUser();
        const { productId } = await req.json();

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

        const item = await prisma.wishlistItem.findFirst({
            where: {
                userId: user.id,
                productId
            }
        })

        if (item) {
            return NextResponse.json({ isWishlisted: true }, { status: 201 });
        }

        return NextResponse.json({ isWishlisted: false }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}