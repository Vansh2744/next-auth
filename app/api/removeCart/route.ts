import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Product id is required" }, { status: 400 })
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

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                userId: user.id,
                productId: id
            }
        });

        if (!cartItem) {
            return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
        }

        await prisma.cartItem.delete({
            where: {
                id: cartItem.id
            }
        });

        return NextResponse.json({ message: "Cart item deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}