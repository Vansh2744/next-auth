import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { mainImage, firstImage, secondImage, thirdImage, fourthImage, fifthImage, title, description, price, category } = await req.json();

        if (!mainImage || !firstImage || !secondImage || !thirdImage || !fourthImage || !fifthImage) {
            return NextResponse.json({ message: "All Fileds are required" }, { status: 401 })
        }

        const res = await prisma.product.create({
            data: {
                title,
                description,
                category,
                price: Number(price),
                mainImage,
                firstImage,
                secondImage,
                thirdImage,
                fourthImage,
                fifthImage
            }
        })

        return NextResponse.json({ res })

    } catch (error) {
        return NextResponse.json({ message: "Failed to Upload Images", error }, { status: 401 })
    }
}