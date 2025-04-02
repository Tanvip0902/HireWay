import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendJobApplicationEmail = async (
  companyEmail: string,
  jobTitle: string,
  candidateName: string,
  candidateEmail: string,
 
) => {
  try {
    await resend.emails.send({
      from: "Jobportal <notifications@yourdomain.com>",
      to: companyEmail,
      subject: `New Job Application for ${jobTitle}`,
      html: `
        <h2>A new candidate has applied for ${jobTitle}</h2>
        <p><strong>Candidate Name:</strong> ${candidateName}</p>
        <p><strong>Email:</strong> ${candidateEmail}</p>
       
        <a href="https://yourjobportal.com/company-dashboard" 
           style="display:inline-block;padding:10px 20px;margin-top:10px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
           View Application
        </a>
      `,
    });

    console.log("Job application email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
