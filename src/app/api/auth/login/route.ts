import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { loginSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";

const limiter = rateLimit(10, 60_000);

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
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    const email = parsed.data.email.trim();
    const password = parsed.data.password;
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const user = await User.findOne({
      email: new RegExp(`^${escapedEmail}$`, "i"),
    }).select("+password name email role");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (typeof user.password !== "string" || user.password.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Create JWT using jose for Edge compatibility if needed, though we are using Node runtime mostly
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret_please_change",
    );
    const token = await new SignJWT({ userId: String(user._id), role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    const authUser = {
      _id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: { user: authUser },
        user: authUser,
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[/api/auth/login] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
