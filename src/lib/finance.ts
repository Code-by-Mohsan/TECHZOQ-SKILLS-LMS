import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";
import Counter from "@/models/Counter";
import type { ClientSession } from "mongoose";

export async function generateInvoiceNumber() {
  const prefix = "INV";
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const counter = await Counter.findOneAndUpdate(
    { name: `invoice_${stamp}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return `${prefix}-${stamp}-${String(counter.seq).padStart(4, "0")}`;
}

export async function getStudentBalance(
  studentId: string,
  session?: ClientSession,
): Promise<number> {
  const lastEntry = await LedgerEntry.findOne({ student: studentId })
    .session(session || null)
    .sort({ createdAt: -1 })
    .select("balanceAfter")
    .lean() as { balanceAfter?: number } | null;
  return lastEntry?.balanceAfter || 0;
}

