
import { saveJobPost, unSaveJobPost } from "@/app/action";
import arcjet, {detectBot,tokenBucket} from "@/app/utils/arcjet";
import { auth } from "@/app/utils/auth";
import { getFlagEmoji } from "@/app/utils/countriesList";
import { prisma } from "@/app/utils/db";
import { benefits } from "@/app/utils/listOfBenefits";
import { JsonToHtml } from "@/components/general/JsonToHtml";
import { SaveJobButton } from "@/components/general/SubmitButton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {  request } from "@arcjet/next";
import { FileText, Heart, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ApplyButton from "@/components/general/ApplyButton";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import CompanyReviews from "@/components/general/CompanyReviews";
import ReviewSubmissionForm from "@/components/general/CompanyReviews";


const aj = arcjet.withRule(
    detectBot({
        mode: "LIVE",
        allow: ["CATEGORY:SEARCH_ENGINE","CATEGORY:PREVIEW"],
    })
);
function getClient(session : boolean) {
    if(session) {
        return aj.withRule(
            tokenBucket({
                mode: 'DRY_RUN',
                capacity: 200,
                interval: 60,
                refillRate: 60,
            })
        );
    }else {
        return aj.withRule(
            tokenBucket({
                mode: 'DRY_RUN',
                capacity: 100,
                interval: 60,
                refillRate:10,
            })
        )
    }
}

async function getJob(jobId: string, userId?: string): Promise<{
    jobData: {
        jobTitle: string;
        jobDescription: string;
        location: string;
        employmentType: string;
        benefits: string[];
        createdAt: Date;
        listingDuration: number;
        views: number;
        Company: {
             id: string,
            name: string;
            logo: string | null;
            location: string;
            about: string;
            user: {
                email: string | null; // ✅ Fix type
            };
        };
    };
    savedJob: { id: string } | null;
}> {
    const [jobData, savedJob] = await Promise.all([
        prisma.jobPost.update({
            where: {
                id: jobId,
                status: "ACTIVE",
            },
            data: {
                views: { increment: 1 }, // Increment job views
            },
            select: {
                jobTitle: true,
                jobDescription: true,
                location: true,
                employmentType: true,
                benefits: true,
                createdAt: true,
                listingDuration: true,
                views: true, // Fetch the updated views count
                Company: {
                    select: {
                        id:true,
                        name: true,
                        logo: true,
                        location: true,
                        about: true,
                        user: {
                            select: {
                                email: true, // ✅ Ensure `email` is fetched correctly
                            },
                        },
                    },
                },
            },
        }),
        userId
            ? prisma.savedJobPost.findUnique({
                  where: {
                      userId_jobPostId: {
                          userId: userId,
                          jobPostId: jobId,
                      },
                  },
                  select: {
                      id: true,
                  },
              })
            : null,
    ]);

    if (!jobData) {
        return notFound();
    }

    return {
        jobData,
        savedJob,
    };
}



type Params = {
    jobId: string;
  };
  
  export default async function JobIdPage({ params }: { params: Params }) {
    const { jobId } =  await params;
    const session = await auth();
    const req = await request();
    const decision = await getClient(!!session).protect(req, { requested: 10 });
  
    if (decision.isDenied()) {
      throw new Error("Forbidden");
    }
  
    const { jobData: data, savedJob, jobData } = await getJob(jobId, session?.user?.id);
    const locationFlag = getFlagEmoji(data.location);
    const jobSeeker = await prisma.jobSeeker.findUnique({
      where: {
        userId: session?.user.id,

      },
    });
 
    return (
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-8 col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{data.jobTitle}</h1>
              <div className="flex items-center gap-2 mt-2">
               
                <p className="text-sm text-muted-foreground">👀 {data.views} views</p>
  
                <span className="hidden md:inline text-muted-foreground">*</span>
                <Badge className="rounded-full" variant="secondary">
                  {data.employmentType}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">*</span>
                <Badge className="rounded-full">
                  {locationFlag && <span className="mr-1">{locationFlag}</span>} {data.location}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
    {/* Save Job Button */}
    {session?.user ? (
        <form action={savedJob ? unSaveJobPost.bind(null, savedJob.id) : saveJobPost.bind(null, jobId)}>
            <SaveJobButton savedJob={!!savedJob} />
        </form>
    ) : (
        <Link href="/login" className={buttonVariants({ variant: "outline", className: "flex items-center gap-1" })}>
            <Heart className="size-4" /> Save Job
        </Link>
    )}
</div>

          </div>
  
          <section>
            <JsonToHtml json={JSON.parse(data.jobDescription)} />
          </section>
  
          <section>
            <h3 className="font-semi-bold mb-4">
              Benefits <span className="text-sm text-muted-foreground font-normal">(green is offered)</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {benefits.map((benefit) => {
                const isOffered = data.benefits.includes(benefit.id);
                return (
                  <Badge
                    className={cn(isOffered ? "" : "opacity-75 cursor-not-allowed", "text-sm px-4 py-1.5 rounded-full")}
                    key={benefit.id}
                    variant={isOffered ? "default" : "outline"}
                  >
                    <span className="flex items-center gap-2">
                      {benefit.icon}
                      {benefit.label}
                    </span>
                  </Badge>
                );
              })}
            </div>
          </section>
        </div>
  
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Apply Now</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please let {data.Company.name} know you found this job on HireWay. This helps us grow!
                </p>
              </div>
              <div className="flex items-center gap-3">
              {session && jobSeeker?.resume && jobData?.Company?.user?.email && (
  <a
    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${jobData.Company.user.email}&su=Job Application via HireWay&body=${encodeURIComponent(
      `Hi,\n\nI am interested in this role.\n\nMy resume: ${jobSeeker.resume}\n\nBest regards`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
  >
    <Mail size={18} />
    Apply Now
  </a>
)}
</div>

            </div>
          </Card>
  
          <Card className="p-6">
            <h3 className="font-semibold">About the Job</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Apply Before</span>
                <span className="text-sm">
                  {new Date(
                    data.createdAt.getTime() + data.listingDuration * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Posted on</span>
                <span className="text-sm">
                  {data.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Employment Type</span>
                <span className="text-sm">{data.employmentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-sm">{data.location}</span>
              </div>
            </div>
          </Card>
      
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src={data.Company.logo ?? "/default-company-logo.png"}
                  alt="Company logo"
                  width={48}
                  height={48}
                  className="rounded-full size-12"
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold">{data.Company.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{data.Company.about}</p>
                </div>
             
              </div>
            </div>
          </Card>
          {session?.user && (
  <Card className="p-2">
    <ReviewSubmissionForm companyId={data.Company.id} />
  </Card>
)}
        </div>
      </div>
    );
  }
  