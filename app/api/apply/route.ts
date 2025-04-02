import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const session = await auth(); // Using `auth()` instead of `getServerSession`

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { jobId } = await req.json();

        if (!jobId) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        }

        // Find the user in the database using their email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if the user already applied for the job
        const existingApplication = await prisma.jobApplication.findFirst({
            where: {
                userId: user.id,
                jobId: jobId,
            },
        });

        if (existingApplication) {
            return NextResponse.json({ error: "Already Applied" }, { status: 400 });
        }

        // Create the job application
        const application = await prisma.jobApplication.create({
            data: {
                jobId: jobId,
                userId: user.id, // Ensure user.id is always a string
            },
        });

        return NextResponse.json({ message: "Application submitted successfully", application }, { status: 201 });
    } catch (error) {
        console.error("Error submitting application:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
