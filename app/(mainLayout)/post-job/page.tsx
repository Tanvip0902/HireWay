import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import CreateJobForm from "@/components/forms/CreateJobForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import Image from "next/image";
import { redirect } from "next/navigation";

// ✅ Replace logo imports with a public folder path
const companies = [
    { id: 0, name: "Arcjet", logo: "/arcjet.jpg" },
    { id: 1, name: "Inngest", logo: "/inngest.png" },
    { id: 2, name: "Arcjet", logo: "/arcjet.jpg" },
    { id: 3, name: "Inngest", logo: "/inngest.png" },
    { id: 4, name: "Arcjet", logo: "/arcjet.jpg" },
    { id: 5, name: "Inngest", logo: "/inngest.png" },
];

const testimonials = [
    {
        quote: "We found our ideal candidate within 48 hours of posting. The quality of applicants was exceptional!",
        author: "Sarah Chen",
        company: "TechCorp",
    },
    {
        quote: "This portal helped us attract remote talent from across the globe, opening up a whole new world of possibilities for our company.",
        author: "Carlos Martinez",
        company: "CTO at GlobalLink Technologies",
    },
    {
        quote: "This platform made my job search effortless. Within a week, I landed interviews at three companies and secured my dream role!",
        author: "Michael Chen",
        company: "Software Engineer at InnovateHub",
    },
];

const stats = [
    { id: 0, value: "10k+", label: "Monthly active job seekers" },
    { id: 1, value: "48h", label: "Average time to hire" },
    { id: 2, value: "90%", label: "Employee satisfaction rate" },
    { id: 3, value: "500+", label: "Companies hiring remotely" },
];

// ✅ Function to fetch company details
async function getCompany(userId: string) {
    const company = await prisma.company.findUnique({
        where: { userId: userId },
        select: {
            name: true,
            location: true,
            about: true,
            logo: true,
            xAccount: true,
            website: true,
        },
    });

    if (!company) {
        return redirect("/post-job");
    }

    return company;
}

// ✅ Post Job Page Component
export default async function PostJobPage() {
    const session = await requireUser();
    const companyData = await getCompany(session.id as string);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
            {/* Job Posting Form */}
            <CreateJobForm
                companyAbout={companyData.about}
                companyLogo={companyData.logo}
                companyName={companyData.name}
                companyXAccount={companyData.xAccount}
                companylocation={companyData.location}
                companywebsite={companyData.website}
            />

            {/* Sidebar - Trusted Companies & Testimonials */}
            <div className="col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Trusted by Industry Leaders</CardTitle>
                        <CardDescription>Join thousands of companies hiring top talent</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Company Logos */}
                        <div className="grid grid-cols-3 gap-4">
                            {companies.map((company) => (
                                <div key={company.id}>
                                    <Image
                                        src={company.logo}
                                        alt={company.name}
                                        width={80}
                                        height={80}
                                        className="rounded-lg opacity-75 transition-opacity hover:opacity-100"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Testimonials */}
                        <div className="space-y-4">
                            {testimonials.map((testimonial, index) => (
                                <blockquote key={index} className="border-l-2 border-primary pl-4">
                                    <p className="text-sm text-muted-foreground italic">"{testimonial.quote}"</p>
                                    <footer className="mt-2 text-sm font-medium">
                                        - {testimonial.author}, {testimonial.company}
                                    </footer>
                                </blockquote>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat) => (
                                <div key={stat.id} className="rounded-lg bg-muted p-4">
                                    <h4 className="text-2xl font-bold">{stat.value}</h4>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
