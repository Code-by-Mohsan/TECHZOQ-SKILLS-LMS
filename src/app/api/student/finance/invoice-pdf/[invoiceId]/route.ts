import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import Student from "@/models/Student";
import Invoice from "@/models/Invoice";
import PaymentSubmission from "@/models/PaymentSubmission";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface RouteParams {
  params: Promise<{ invoiceId: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { invoiceId } = await params;
    await dbConnect();

    const student = (await Student.findOne({ user: auth.userId })
      .populate("user", "firstName lastName email")
      .lean()) as Record<string, unknown> | null;
    if (!student) {
      return NextResponse.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const invoice = (await Invoice.findOne({ _id: invoiceId, student: student._id })
      .populate("course", "title")
      .populate("batch", "name")
      .lean()) as Record<string, unknown> | null;

    if (!invoice) {
      return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
    }

    const payments = (await PaymentSubmission.find({
      invoice: invoiceId,
      verificationStatus: { $in: ["verified", "submitted"] },
    })
      .sort({ createdAt: -1 })
      .lean()) as Record<string, unknown>[];

    const pdfBytes = await buildInvoicePDF(invoice, student, payments);
    const buffer = Buffer.from(pdfBytes);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate PDF";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

/* ── PDF Builder ─────────────────────────────────── */

async function buildInvoicePDF(
  invoice: Record<string, unknown>,
  student: Record<string, unknown>,
  payments: Record<string, unknown>[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const blue = rgb(0.12, 0.36, 0.71);
  const darkGray = rgb(0.2, 0.2, 0.2);
  const gray = rgb(0.45, 0.45, 0.45);
  const lightBg = rgb(0.96, 0.96, 0.98);
  const white = rgb(1, 1, 1);
  const green = rgb(0.05, 0.5, 0.18);

  const margin = 50;
  let y = height - margin;

  // ── Header ──
  page.drawRectangle({
    x: 0,
    y: y - 40,
    width,
    height: 60,
    color: blue,
  });

  page.drawText("TECHZOQ", {
    x: margin,
    y: y - 22,
    size: 22,
    font: fontBold,
    color: white,
  });

  page.drawText("INVOICE", {
    x: width - margin - fontBold.widthOfTextAtSize("INVOICE", 22),
    y: y - 22,
    size: 22,
    font: fontBold,
    color: white,
  });

  y -= 70;

  // ── Invoice Info Row ──
  const course = invoice.course as Record<string, unknown> | null;
  const batch = invoice.batch as Record<string, unknown> | null;
  const user = student.user as Record<string, unknown> | null;

  const infoLeft = [
    { label: "Invoice #:", value: String(invoice.invoiceNumber || "") },
    { label: "Date:", value: formatDate(invoice.issuedAt) },
    { label: "Due Date:", value: invoice.dueDate ? formatDate(invoice.dueDate) : "—" },
    { label: "Status:", value: String(invoice.status || "").replace(/_/g, " ").toUpperCase() },
  ];

  const studentName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "—";
  const studentEmail = user ? String(user.email || "") : "";

  const infoRight = [
    { label: "Student:", value: studentName },
    { label: "Email:", value: studentEmail },
    { label: "Phone:", value: String(student.phone || "—") },
    { label: "Course:", value: String(course?.title || "—") },
  ];

  if (batch?.name) {
    infoRight.push({ label: "Batch:", value: String(batch.name) });
  }

  // Left column
  for (const item of infoLeft) {
    page.drawText(item.label, { x: margin, y, size: 9, font: fontBold, color: gray });
    page.drawText(item.value, { x: margin + 70, y, size: 9, font: fontRegular, color: darkGray });
    y -= 16;
  }

  // Right column (same starting y)
  let yRight = y + 16 * infoLeft.length;
  for (const item of infoRight) {
    const labelX = width / 2 + 30;
    page.drawText(item.label, { x: labelX, y: yRight, size: 9, font: fontBold, color: gray });
    page.drawText(item.value, { x: labelX + 60, y: yRight, size: 9, font: fontRegular, color: darkGray });
    yRight -= 16;
  }

  y -= 20;

  // ── Fee Summary Table ──
  const tableTop = y;
  const colX = [margin, margin + 280, margin + 380];
  const colW = width - 2 * margin;

  // Header row
  page.drawRectangle({ x: margin, y: tableTop - 18, width: colW, height: 22, color: blue });
  page.drawText("Description", { x: colX[0] + 8, y: tableTop - 13, size: 10, font: fontBold, color: white });
  page.drawText("Qty / Detail", { x: colX[1] + 8, y: tableTop - 13, size: 10, font: fontBold, color: white });
  page.drawText("Amount (PKR)", { x: colX[2] + 8, y: tableTop - 13, size: 10, font: fontBold, color: white });

  y = tableTop - 22;

  const rows = [
    { desc: "Course Fee (Subtotal)", detail: "1", amount: formatNum(Number(invoice.subtotalAmount || 0)) },
  ];
  if (Number(invoice.discountAmount || 0) > 0) {
    rows.push({ desc: "Discount", detail: "", amount: `- ${formatNum(Number(invoice.discountAmount))}` });
  }
  rows.push({ desc: "Total Amount", detail: "", amount: formatNum(Number(invoice.totalAmount || 0)) });
  rows.push({ desc: "Paid Amount", detail: "", amount: formatNum(Number(invoice.paidAmount || 0)) });
  rows.push({ desc: "Due Amount", detail: "", amount: formatNum(Number(invoice.dueAmount || 0)) });

  for (let i = 0; i < rows.length; i++) {
    const rowY = y - i * 22;
    const bg = i % 2 === 0 ? lightBg : white;
    page.drawRectangle({ x: margin, y: rowY - 16, width: colW, height: 22, color: bg });

    const isTotal = rows[i].desc === "Total Amount" || rows[i].desc === "Due Amount";
    const f = isTotal ? fontBold : fontRegular;
    const c = rows[i].desc === "Due Amount" ? blue : darkGray;

    page.drawText(rows[i].desc, { x: colX[0] + 8, y: rowY - 11, size: 9, font: f, color: c });
    page.drawText(rows[i].detail, { x: colX[1] + 8, y: rowY - 11, size: 9, font: fontRegular, color: gray });
    page.drawText(rows[i].amount, { x: colX[2] + 8, y: rowY - 11, size: 9, font: f, color: c });
  }

  y -= rows.length * 22 + 30;

  // ── Payment Records ──
  if (payments.length > 0) {
    page.drawText("Payment Records", { x: margin, y, size: 11, font: fontBold, color: darkGray });
    y -= 20;

    const payColX = [margin, margin + 100, margin + 230, margin + 350];
    page.drawRectangle({ x: margin, y: y - 14, width: colW, height: 20, color: blue });
    page.drawText("Date", { x: payColX[0] + 8, y: y - 10, size: 9, font: fontBold, color: white });
    page.drawText("Method", { x: payColX[1] + 8, y: y - 10, size: 9, font: fontBold, color: white });
    page.drawText("Reference", { x: payColX[2] + 8, y: y - 10, size: 9, font: fontBold, color: white });
    page.drawText("Amount (PKR)", { x: payColX[3] + 8, y: y - 10, size: 9, font: fontBold, color: white });
    y -= 18;

    for (let i = 0; i < payments.length && y > 100; i++) {
      const p = payments[i];
      const rowY = y - i * 18;
      const bg = i % 2 === 0 ? lightBg : white;
      page.drawRectangle({ x: margin, y: rowY - 12, width: colW, height: 18, color: bg });

      page.drawText(formatDate(p.createdAt), { x: payColX[0] + 8, y: rowY - 8, size: 8, font: fontRegular, color: darkGray });
      page.drawText(String(p.paymentMethod || "").replace(/_/g, " "), { x: payColX[1] + 8, y: rowY - 8, size: 8, font: fontRegular, color: darkGray });
      page.drawText(truncate(String(p.transactionReference || "—"), 25), { x: payColX[2] + 8, y: rowY - 8, size: 8, font: fontRegular, color: darkGray });
      page.drawText(formatNum(Number(p.amount || 0)), { x: payColX[3] + 8, y: rowY - 8, size: 8, font: fontRegular, color: darkGray });
    }
    y -= payments.length * 18 + 20;
  }

  // ── Payment Account Details Box ──
  if (y > 140) {
    y = Math.min(y, 200);
    page.drawRectangle({
      x: margin,
      y: y - 70,
      width: colW,
      height: 80,
      color: rgb(0.93, 0.95, 1),
      borderColor: blue,
      borderWidth: 1,
    });

    page.drawText("Payment Account Details", {
      x: margin + 12,
      y: y - 10,
      size: 10,
      font: fontBold,
      color: blue,
    });

    const accountLines = [
      "Account Number: 03029517405",
      "Account Name: Mohsan Ali",
      "Method: JazzCash / EasyPaisa / Bank Transfer",
      "After payment, submit proof on your finance portal.",
    ];
    for (let i = 0; i < accountLines.length; i++) {
      page.drawText(accountLines[i], {
        x: margin + 12,
        y: y - 28 - i * 14,
        size: 8,
        font: i === 3 ? fontBold : fontRegular,
        color: i === 3 ? green : darkGray,
      });
    }
  }

  // ── Footer ──
  page.drawText("This is a system-generated invoice.", {
    x: margin,
    y: 40,
    size: 7,
    font: fontRegular,
    color: gray,
  });
  page.drawText("techzoq.com", {
    x: width - margin - fontRegular.widthOfTextAtSize("techzoq.com", 7),
    y: 40,
    size: 7,
    font: fontRegular,
    color: gray,
  });

  return doc.save();
}

/* ── Helpers ──────────────────────────────────────── */

function formatDate(val: unknown): string {
  if (!val) return "—";
  const d = new Date(val as string);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatNum(n: number): string {
  return n.toLocaleString("en-PK");
}

function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max)}…` : str;
}
