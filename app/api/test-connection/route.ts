import { NextResponse } from "next/server"

export async function POST() {
  try {
    // This route is just for testing the connection, no actual logic needed here.
    return NextResponse.json({ success: true, message: "API connection test successful." })
  } catch (error) {
    console.error("Error testing connection:", error)
    return NextResponse.json({ success: false, message: "API connection test failed." }, { status: 500 })
  }
}
