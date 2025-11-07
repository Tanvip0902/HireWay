import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: { companyId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to submit a review" },
        { status: 401 }
      );
    }

    const { companyId } = context.params;
    const { rating, reviewText }: { rating: number; reviewText: string } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    if (!reviewText || reviewText.trim().length < 3) {
      return NextResponse.json({ error: "Review text must be at least 3 characters long" }, { status: 400 });
    }

    const company = await prisma.company.findUnique({ where: { id: companyId } });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Check if the user has already reviewed this company
    const existingReview = await prisma.review.findFirst({
      where: { userId, companyId },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this company", alreadyReviewed: true },
        { status: 400 }
      );
    }

    // If no existing review, create a new one
    const review = await prisma.review.create({
      data: { rating, reviewText, userId, companyId },
    });

    return NextResponse.json({ success: true, review }, { status: 200 });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ success: false, message: "Failed to submit review" }, { status: 500 });
  }
}



export async function GET(
  _request: NextRequest,
  context: { params: { companyId: string } }
) {
  try {
    const { companyId } = context.params;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
