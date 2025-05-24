import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("user", "", { maxAge: 0, path: "/" });

  return NextResponse.json({ success: true });
}
