import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await prisma.product.findMany();

        if (!products) {
            return NextResponse.json({ message: "Products are not available" }, { status: 401 })
        }

        return NextResponse.json({ products }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Unable to get products", error }, { status: 401 })
    }
}