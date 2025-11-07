import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const prisma = new PrismaClient();

export async function GET() {
  // Fetch all predefined questions and answers
  const questions = await prisma.knowledgeBase.findMany();
  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    // 1. Match with fixed DB question
    const existing = await prisma.knowledgeBase.findFirst({
      where: {
        question: {
          equals: message,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return NextResponse.json({ answer: existing.answer });
    }

    // 2. If not matched, use Gemini
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" }); // ✅ updated model name

    const result = await model.generateContent(message);
    const response = await result.response.text();

    return NextResponse.json({ answer: response });
  } catch (error: any) {
    console.error("Chatbot Error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
