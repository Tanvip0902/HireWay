import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️ Deleting existing knowledge base and interview resources...');
  await prisma.knowledgeBase.deleteMany();
  await prisma.interviewResource.deleteMany(); // Clear old interview resources

  console.log('🌱 Seeding database with website-related questions...');
  const questions = [
    {
      question: 'What is this website about?',
      answer: 'This is a job portal where job seekers find jobs and recruiters post job listings.',
    },
    {
      question: 'How do I apply for a job?',
      answer: "Click 'Apply' on the job listing page to submit your application.",
    },
    {
      question: 'How do I create an account?',
      answer: "Click 'Sign Up' and enter your details to register.",
    },
    {
      question: 'Is this platform free?',
      answer: 'Yes, job seekers can use this platform for free. Employers may have premium options for job postings.',
    },
    {
      question: 'How do I reset my password?',
      answer: "Go to 'Forgot Password' on the login page and follow the steps.",
    },
  ];

  await prisma.knowledgeBase.createMany({ data: questions });

  console.log('🌱 Seeding interview preparation resources...');
  const interviewResources = [
    {
      "title": "Marketing Interview Questions",
      "description": "Common marketing interview questions with sample answers.",
      "category": "Marketing",
      "link": "https://www.thebalancemoney.com/marketing-job-interview-questions-2061205"
    },
    {
      "title": "Customer Success Manager Interview Guide",
      "description": "Key questions asked in Customer Success Manager interviews.",
      "category": "Customer Success",
      "link": "https://www.gainsight.com/blog/11-customer-success-manager-interview-questions/"
    },
    {
      "title": "Full-Stack Developer Interview Questions",
      "description": "Important questions for Full-Stack Developer technical interviews.",
      "category": "Full-Stack Development",
      "link": "https://www.interviewbit.com/full-stack-developer-interview-questions/"
    },
    {
      "title": "Data Analyst Interview Guide",
      "description": "Comprehensive questions for Data Analyst job interviews.",
      "category": "Data Analysis",
      "link": "https://www.interviewquery.com/p/data-analyst-interview-questions"
    },
    {
      "title": "Senior Software Engineer Interview Questions",
      "description": "Advanced questions for Senior Software Engineer technical rounds.",
      "category": "Software Engineering",
      "link": "https://www.interviewkickstart.com/interview-questions/senior-software-engineer-interview-questions"
    },
    {
      "title": "UX/UI Designer Interview Guide",
      "description": "Common UX/UI design questions for job interviews.",
      "category": "UI/UX Design",
      "link": "https://careerfoundry.com/en/blog/ux-design/ux-designer-interview-questions/"
    },
    {
      "title": "Software Engineer System Design Questions",
      "description": "Essential system design concepts for Software Engineer interviews.",
      "category": "System Design",
      "link": "https://www.interviewbit.com/system-design-interview-questions/"
    }
  ];
  

  await prisma.interviewResource.createMany({ data: interviewResources });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
