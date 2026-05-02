import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import ApplicationNote from "@/models/ApplicationNote";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const createNoteSchema = z.object({
  text: z.string().min(1).max(2000),
  noteType: z.enum(["internal", "student_visible"]).default("internal"),
});

export async function GET(req: Request, { params }: RouteParams) {
  const permissionCheck = await requirePermissions(req, ["application.review"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { id } = await params;

    const notes = await ApplicationNote.find({ application: id })
      .populate("authorUser", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: notes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load notes";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  const permissionCheck = await requirePermissions(req, ["application.review"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = createNoteSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const { id } = await params;

    const note = await ApplicationNote.create({
      application: id,
      authorUser: permissionCheck.auth?.userId,
      text: parsed.data.text,
      noteType: parsed.data.noteType,
    });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create note";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

