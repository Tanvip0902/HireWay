import { z } from "zod";

export const companySchema=z.object({
    name:z.string().min(2,'company name must be at least 2 characters'),
    location: z.string().min(1,'Location must be defined'),
    about: z.string().min(10,'please  provide some information about your company'),
    logo:z.string().min(1,'please upload the logo'),
    website: z.string().url('please enter valid URL'),
    xAccount: z.string().optional(),
});

export const jobSeekerSchema=z.object({
    name: z.string().min(2,'Name must be at least 2 characters'),
    about: z.string().min(10,'please  provide more information about yourself'),
    resume: z.string().min(1,'please upload your resume'),
})

export const jobSchema= z.object({
    jobTitle: z.string().min(2,"job title must beat least 2 characters long"),
    employmentType: z.string().min(1,"please select an employment type"),
    location:z.string().min(1,"please select location"),
    salaryFrom: z.number().min(0,"salary from is required"),
    salaryTo: z.number().min(0,"salary to is required"),
    jobDescription: z.string().min(1,"job description is required"),
    listingDuration: z.number().min(1,"Listing duration is required"),
    benefits:z.array(z.string()).min(1,"please select atleast one benefit"),
    companyName: z.string().min(1,"company name is required"),
    companylocation: z.string().min(1,"location is required"),
    companyAbout: z.string().min(10,"company description is required"),
    companyLogo:z.string().min(1,"logo is required"),
    companywebsite:z.string().min(1,"Company website is required"),
    companyXAccount:z.string().optional()
});
