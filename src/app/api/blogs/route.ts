import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { jwtVerify } from "jose";

// Helper to verify token
async function verifyToken(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret_please_change",
    );
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .populate("author", "name");
    return NextResponse.json({ success: true, data: blogs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const user = await verifyToken(req);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const blog = await Blog.create({ ...body, author: user.userId });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
