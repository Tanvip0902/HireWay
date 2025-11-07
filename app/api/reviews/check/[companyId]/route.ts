import { auth } from '@/app/utils/auth';
import { prisma } from '@/app/utils/db';
import { NextResponse } from 'next/server';


export async function GET(request: Request, context: { params: { companyId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = context.params;

    if (!companyId) {
      return NextResponse.json({ message: 'Missing companyId' }, { status: 400 });
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        companyId,
      },
    });

    return NextResponse.json({ hasReviewed: !!existingReview });
  } catch (error) {
    console.error('Check review error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
