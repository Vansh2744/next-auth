import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Product {
    userId: string;
    productId: string;
}

export async function POST(req: Request) {
    try {
        const { products, name, address, state, pincode, phone } = await req.json();

        products.map(async (product: Product) => {
            await prisma.order.create({
                data: {
                    userId: product.userId,
                    productId: product.productId,
                    name, address, state, pincode, phone
                }
            })
        })

        return NextResponse.json({ message: "Order Placed" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}