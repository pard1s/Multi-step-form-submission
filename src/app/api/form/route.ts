import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ResumeFormSchema } from "@/lib/types";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Server-side validation with Zod
    const validationResult = ResumeFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create the submission record
    const submission = await prisma.submission.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,

        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        website: data.website,
        facebook: data.facebook,
        instagram: data.instagram,
        linkedin: data.linkedin,
        skills: data.skills,
        languages: data.languages,
        interests: data.interests,
        hobbies: data.hobbies,
        experiences: data.experiences,
        education: data.education,
      },
    });

    console.log("Attempting to send email...");

    // Send email confirmation after successful submission
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: data.email,
      subject: "Form Submission Confirmation",
      html: `
        <h1>Thank you for your submission, ${data.firstName}!</h1>
        <p>We have received your form. Here's a summary of your details:</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <p>We will be in touch shortly.</p>
      `,
    });

    console.log("Email sent successfully to:", data.email);

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error submitting form:", error);

    if (error instanceof Error && (error as any).code === "P2002") {
      return NextResponse.json(
        { message: "A submission with this email already exists." },
        { status: 409 } // 409 Conflict
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
