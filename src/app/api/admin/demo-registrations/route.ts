import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import DemoRegistration from "@/models/DemoRegistration";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["application.review"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 20),
    );
    const search = searchParams.get("search") || "";

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const [registrations, total] = await Promise.all([
      DemoRegistration.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      DemoRegistration.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { registrations, total, page, limit },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
