import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const id = searchParams.get("id") ?? undefined;

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

        const product = await prisma.cartItem.findFirst({
            where: {
                userId: user.id,
                productId: id
            }
        })

        if (product) {
            return NextResponse.json({ cart: true }, { status: 201 })
        }

        return NextResponse.json({ cart: false }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error })
    }
}