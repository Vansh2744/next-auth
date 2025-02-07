import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
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

        const products = await prisma.cartItem.findMany({
            where: {
                userId: user.id,
            },
            include: {
                product: true
            }
        });

        if (!products) {
            return NextResponse.json({ message: "No product foud in the cart" }, { status: 401 })
        }

        return NextResponse.json({ products }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Unable to fetch cartItems", error }, { status: 401 })
    }
}