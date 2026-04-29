import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { isAdminRole } from "@/lib/constants/auth";

export function verifyAdmin(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return {
      auth: null,
      error: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }
  if (!isAdminRole(auth.role)) {
    return {
      auth: null,
      error: NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      ),
    };
  }
  return { auth, error: null };
}
