import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Lead from "@/models/Lead";
import Student from "@/models/Student";
import Application from "@/models/Application";
import LeadActivity from "@/models/LeadActivity";
import { leadConvertSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import User from "@/models/User";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";
import bcrypt from "bcryptjs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionCheck = await requirePermissions(req, ["lead.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = leadConvertSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const { id } = await params;
    const result = await runInTransaction(async (session) => {
      const lead = await Lead.findById(id).session(session);
      if (!lead) {
        throw new HttpRouteError(404, "Lead not found");
      }
      if (lead.isConverted && lead.convertedToApplication) {
        return {
          lead,
          applicationId: String(lead.convertedToApplication),
          mappedToExisting: true,
          applicationCreated: false,
        };
      }

      let studentId = parsed.data.studentId || "";
      let userId = "";
      if (!studentId) {
        // Try to find existing User by email
        let user = (await User.findOne({ email: lead.email.toLowerCase().trim() })
          .session(session)
          .select("_id")
          .lean()) as { _id?: unknown } | null;

        if (user?._id) {
          userId = String(user._id);
          const studentByEmail = (await Student.findOne({ user: user._id })
            .session(session)
            .select("_id")
            .lean()) as { _id?: unknown } | null;
          if (studentByEmail?._id) studentId = String(studentByEmail._id);
        }

        // Try finding student by phone
        if (!studentId && lead.phone) {
          const studentByPhone = (await Student.findOne({ phone: lead.phone })
            .session(session)
            .select("_id user")
            .lean()) as { _id?: unknown; user?: unknown } | null;
          if (studentByPhone?._id) {
            studentId = String(studentByPhone._id);
            if (studentByPhone.user) userId = String(studentByPhone.user);
          }
        }

        // Auto-create User if not found
        if (!userId) {
          if (!lead.email) {
            throw new HttpRouteError(400, "Lead must have an email to create an application.");
          }
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash("12345678", salt);
          const [newUser] = await User.create(
            [{ name: lead.name, email: lead.email.toLowerCase().trim(), password: hashedPassword, role: "student" }],
            { session },
          );
          userId = String(newUser._id);
        }

        // Auto-create Student profile if not found
        if (!studentId) {
          const [newStudent] = await Student.create(
            [{
              user: userId,
              phone: lead.phone || "",
              address: "N/A",
              city: "N/A",
            }],
            { session },
          );
          studentId = String(newStudent._id);
        }
      }

      const existingApplication = await Application.findOne({
        student: studentId,
        course: parsed.data.courseId,
      })
        .session(session)
        .select("_id");

      const applicationId = existingApplication
        ? String(existingApplication._id)
        : String(
            (
              await Application.create(
                [
                  {
                    student: studentId,
                    course: parsed.data.courseId,
                    status: "submitted",
                    leadSource: lead.source || "direct",
                    campaignSource: lead.campaign || "",
                    appliedAt: new Date(),
                    createdBy: permissionCheck.auth?.userId ?? null,
                    updatedBy: permissionCheck.auth?.userId ?? null,
                  },
                ],
                { session },
              )
            )[0]._id,
          );

      lead.isConverted = true;
      lead.status = "converted";
      lead.convertedToApplication = applicationId as any;
      lead.convertedAt = new Date();
      if (permissionCheck.auth?.userId) {
        lead.updatedBy = permissionCheck.auth.userId as any;
      }
      await lead.save({ session });

      const existingConversionActivity = await LeadActivity.findOne({
        lead: lead._id,
        type: "conversion",
        "meta.applicationId": applicationId,
      })
        .session(session)
        .select("_id")
        .lean();
      if (!existingConversionActivity) {
        await LeadActivity.create(
          [
            {
              lead: lead._id,
              type: "conversion",
              message: "Lead converted to application",
              meta: { applicationId, courseId: parsed.data.courseId, studentId },
              createdBy: permissionCheck.auth?.userId ?? null,
            },
          ],
          { session },
        );
      }

      return {
        lead,
        applicationId,
        mappedToExisting: Boolean(existingApplication),
        applicationCreated: !existingApplication,
      };
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "lead.convert",
      module: "leads",
      entityType: "Lead",
      entityId: String(result.lead._id),
      afterState: {
        isConverted: result.lead.isConverted,
        convertedToApplication: result.applicationId,
        mappedToExisting: result.mappedToExisting,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    if (result.mappedToExisting) {
      return NextResponse.json({
        success: true,
        message: "Lead mapped to existing application",
        data: {
          lead: result.lead,
          applicationId: result.applicationId,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          lead: result.lead,
          applicationId: result.applicationId,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Failed to convert lead";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
