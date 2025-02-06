import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await prisma.cartItem.findMany({
            include: {
                product: true
            }
        });

        if (!products) {
            return NextResponse.json({ message: "No product foud in the cart" }, { status: 401 })
        }

        return NextResponse.json({ products }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Unable to fetch cartItems" }, { status: 401 })
    }
}