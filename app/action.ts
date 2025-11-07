'use server'
import  {date, z} from 'zod'
import { requireUser } from "./utils/requireUser";
import { companySchema, jobSchema, jobSeekerSchema } from './utils/zodSchemas';
import { prisma } from './utils/db';
import { redirect } from 'next/navigation';
import arcjet, { detectBot, shield } from './utils/arcjet';
import { request } from '@arcjet/next';
import { stripe } from './utils/stripe';
import { jobListingDurationPricing } from './utils/jobListingDurationPricing';
import { inngest } from './utils/inngest/client';
import { revalidatePath } from 'next/cache';




const aj = arcjet.withRule(
    shield({
        mode:"LIVE",
    })
).withRule(
    detectBot({
        mode:"LIVE",
        allow:[]
    })
)

export async function createCompany(data: z.infer<typeof companySchema>) {
    const session = await requireUser();
    const req = await request(); // Ensure the request object is in the right format

    // If you're trying to protect the request
    try {
        const decision = await aj.protect(req);

        if (decision.isDenied()) {
            throw new Error('Forbidden');
        }

        const validatedData = companySchema.parse(data);
        
        const company = await prisma.user.update({
            where: {
                id: session.id,
            },
            data: {
                onboardingCompleted: true,
                useType: 'COMPANY',
                Company: {
                    create: {
                        ...validatedData,
                    },
                },
            },
        });

        return company;
    } catch (error) {
        console.error('Error in createCompany:', error);
        throw new Error('Internal Server Error');
    }
}


export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>){
    const user= await requireUser();

    const req = await  request();

    const decision = await aj .protect(req);

    if(decision.isDenied()){
       throw new Error('Forbidden');
    }
    const validateData = jobSeekerSchema.parse(data);
    await prisma.user.update({
        where:{
            id: user.id as string
        },
        data:{
            onboardingCompleted: true,
            useType:"JOB_SEEKER",
            JobSeeker: {
                create:{
                    ...validateData,
                }
            }
        }
    })
   return redirect("/");
}

export async function createJob(data: z.infer<typeof jobSchema>){
    const user = await requireUser();

    const req = await request();
    const decision= await aj.protect(req);
    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }
    const validateData = jobSchema.parse(data);

const company = await prisma.company.findUnique({
    where:{
        userId: user.id
    },
    select:{
        id: true,
        logo: true,
        user: {
            select:{
               stripeCustomerId: true,
            },
        },
    },
});

if(!company?.id){
    return redirect("/");
}

let stripeCustomerId = company.user.stripeCustomerId;

if(!stripeCustomerId) {
  
    const customer = await stripe.customers.create({
        email: user.email as string,
        name: user.name as string,
    });
    stripeCustomerId = customer.id;

    await prisma.user.update({
        where:{
            id: user.id,
  },
        data:{
            stripeCustomerId: customer.id,
        },
    })
}
 const jobpost = await prisma.jobPost.create({
    data: {
        jobTitle: validateData.jobTitle,
        employmentType: validateData.employmentType,
        location: validateData.location,
        salaryFrom: validateData.salaryFrom,
        salaryTo: validateData.salaryTo,
        jobDescription: validateData.jobDescription,
        listingDuration: validateData.listingDuration,
        benefits: validateData.benefits,
        companyId: company.id

    },
    select:{
        id: true,
    }
});

    const pricingTier = jobListingDurationPricing.find(
        (tier) => tier.days === validateData.listingDuration
    );
    if(!pricingTier) {
        throw new Error ("Invaild Listing duration selected");
    }

        await inngest.send({
            name: 'job/created',
            data: {
                jobId: jobpost.id,
                expirationDays: validateData.listingDuration || 30,
            }
        })

        const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items:[
            {
                price_data: {
                    product_data: {
                        name: `Job Posting - ${pricingTier.days} Days`,
                        description: pricingTier.description,
                        images: company.logo ? [company.logo] : [],
                    },
                    currency:  "USD",
                    unit_amount: pricingTier.price * 100,
                },
                quantity: 1,
            },
        ],
        metadata: {
            jobId: jobpost.id,
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
        locale: 'en', 
    })

    return redirect(session.url as string);
}

export async function saveJobPost(jobId: string) {
    const user = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }

    await prisma.savedJobPost.create({
        data: {
            jobPostId: jobId,
            userId: user.id as string,
        },
    });
    revalidatePath(`/job/${jobId}`)
}


export async function unSaveJobPost(savedJobPostId: string) {
    const user = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if(decision.isDenied()) {
        throw new Error ("Forbidden");
    }

    const data =await prisma.savedJobPost.delete({
    where:{
        id: savedJobPostId,
        userId: user.id,
        },
        select: {
            jobPostId: true,
        }
         });
         revalidatePath(`/job/${data.jobPostId}`)
}

export async function editJobPost(
    data: z.infer<typeof jobSchema>,
    jobId: string
  ) {
    const user = await requireUser();
    
    const req = await request();
    const decision = await aj.protect(req);

    if(decision.isDenied()) {
        throw new Error ("Forbidden");
    }
  
    const validatedData = jobSchema.parse(data);
  
    await prisma.jobPost.update({
      where: {
        id: jobId,
        Company: {
          userId: user.id,
        },
      },
      data: {
        jobDescription: validatedData.jobDescription,
        jobTitle: validatedData.jobTitle,
        employmentType: validatedData.employmentType,
        location: validatedData.location,
        salaryFrom: validatedData.salaryFrom,
        salaryTo: validatedData.salaryTo,
        listingDuration: validatedData.listingDuration,
        benefits: validatedData.benefits,
      },
    });
  
    return redirect("/my-jobs");
  }

  export async function deleteJobPost(jobId: string) {
    const session = await requireUser();
  
    const req = await request();
    const decision = await aj.protect(req);

    if(decision.isDenied()) {
        throw new Error ("Forbidden");
    }
    await prisma.jobPost.delete({
      where: {
        id: jobId,
        Company: {
          userId: session.id,
        },
      },
    });
    await inngest.send({
        name: 'job/cancel.expiration',
        data: { jobId: jobId},
    });
    return redirect("/my-jobs");
  }
 
