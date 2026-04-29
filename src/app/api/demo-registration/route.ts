import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DemoRegistration from "@/models/DemoRegistration";

const VALID_COURSES = [
  "Full Stack Web Development",
  "AI Content & Video Creation",
  "Full Stack Graphic Designing",
  "Digital Marketing",
  "Cyber Security & Ethical Hacking",
  "E-Commerce",
];

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const courses: string[] = Array.isArray(body.interestedCourses) ? body.interestedCourses : [];

    if (!body.name || !body.email || !body.phone || courses.length === 0) {
      return NextResponse.json(
        { error: "Name, email, phone, and at least one course are required" },
        { status: 400 },
      );
    }

    const invalidCourses = courses.filter((c: string) => !VALID_COURSES.includes(c));
    if (invalidCourses.length > 0) {
      return NextResponse.json(
        { error: "Invalid course selection" },
        { status: 400 },
      );
    }

    const registration = await DemoRegistration.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      interestedCourses: courses,
      city: body.city || "",
      message: body.message || "",
    });

    return NextResponse.json(
      { success: true, data: registration },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const registrations = await DemoRegistration.find({}).sort({
      createdAt: -1,
    });
    return NextResponse.json(registrations);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
