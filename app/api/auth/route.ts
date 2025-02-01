import ImageKit from "imagekit"
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    privateKey: process.env.PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET(req: Request) {
    try {
        return NextResponse.json(imagekit.getAuthenticationParameters());
    } catch (error) {
        return NextResponse.json({ error })
    }
}