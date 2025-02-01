import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { frontSide, leftSide, rightSide, backSide, title, description, price, category } = await req.json();

        if (!frontSide || !leftSide || !rightSide || !backSide) {
            return NextResponse.json({ message: "All Fileds are required" }, { status: 401 })
        }

        const res = await prisma.product.create({
            data: {
                title,
                description,
                category,
                price: Number(price),
                frontSide,
                leftSide,
                rightSide,
                backSide,
            }
        })

        return NextResponse.json({ res })

    } catch (error) {
        return NextResponse.json({ message: "Failed to Upload Images", error }, { status: 401 })
    }
}