import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const id = searchParams.get("id") ?? undefined;

        const product = await prisma.cartItem.findFirst({
            where: { productId: id }
        })

        if (product) {
            return NextResponse.json({ cart: true }, { status: 201 })
        }

        return NextResponse.json({ cart: false }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error })
    }
}