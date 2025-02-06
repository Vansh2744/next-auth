import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("id");

        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        // Fetch authenticated user
        const currUser = await currentUser();
        if (!currUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const email = currUser.emailAddresses?.[0]?.emailAddress;
        if (!email) {
            return NextResponse.json({ message: "User email not found" }, { status: 400 });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Toggle wishlist: Check if the product is already wishlisted
        const existingWishlistItem = await prisma.wishlistItem.findFirst({
            where: {
                userId: user.id,
                productId: productId
            }
        });

        if (existingWishlistItem) {
            // Remove from wishlist if already wishlisted
            await prisma.wishlistItem.delete({
                where: { id: existingWishlistItem.id }
            });

            return NextResponse.json({
                isWishlisted: false,
                message: "Product removed from wishlist",
            }, { status: 200 });
        }

        // Add to wishlist if not already wishlisted
        await prisma.wishlistItem.create({
            data: {
                userId: user.id,
                productId: product.id
            }
        });

        return NextResponse.json({
            isWishlisted: true,
            message: "Product added to wishlist",
        }, { status: 201 });

    } catch (error) {
        console.error("Error updating wishlist:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
