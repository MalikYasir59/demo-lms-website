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

    // In production, integrate Resend, Sendgrid, or CRM webhook here
    console.log("[Institutional Desk Inquiry Received]:", body);

    return NextResponse.json({
      success: true,
      message: "Inquiry successfully transmitted to the Institutional Desk. An analyst will respond within 15 minutes during live market hours.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please contact the desk directly." },
      { status: 500 }
    );
  }
}

