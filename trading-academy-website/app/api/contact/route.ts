import { NextResponse } from "next/server";
import { ContactFormData } from "@/types";

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();

    if (!body.fullName || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields." },
        { status: 400 }
      );
    }

    // Log inquiry received for instituteoftradingtricks@gmail.com
    console.log("[Inquiry for instituteoftradingtricks@gmail.com]:", body);

    return NextResponse.json({
      success: true,
      message: "Inquiry successfully recorded for instituteoftradingtricks@gmail.com. Our admissions desk will contact you shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please contact the desk directly." },
      { status: 500 }
    );
  }
}

