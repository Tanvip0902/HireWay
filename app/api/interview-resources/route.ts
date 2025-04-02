import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const resources = await prisma.interviewResource.findMany({
      orderBy: { createdAt: "desc" }, // Fetch latest first
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching interview resources:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
