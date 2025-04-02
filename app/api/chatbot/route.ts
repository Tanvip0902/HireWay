import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.knowledgeBase.findMany({
      select: { id: true, question: true, answer: true },
    });

    return NextResponse.json(questions, {
      headers: { "Cache-Control": "no-store" }, // 🔥 Prevent caching issues
    });
  } catch (error) {
    console.error("Error fetching chatbot questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
