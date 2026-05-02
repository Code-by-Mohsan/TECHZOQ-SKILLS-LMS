import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signupSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_please_change";
const limiter = rateLimit(5, 60_000);

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = limiter(ip);
    if (!allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    await dbConnect();

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      city,
      educationLevel,
      institution,
      degree,
      graduationYear,
      interests,
    } = parsed.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 },
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User (always student role from public signup)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    // Create Student Profile linked to User
    const student = await Student.create({
      user: user._id,
      phone,
      address,
      city,
      education: {
        level: educationLevel,
        institution,
        degree,
        graduationYear,
      },
      interests: interests || [],
    });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: String(user._id), role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Create response with cookie
    const response = NextResponse.json(
      {
        message: "Signup successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentProfileId: student._id,
        },
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong during signup";
    return NextResponse.json(
      { message },
      { status: 500 },
    );
  }
}
