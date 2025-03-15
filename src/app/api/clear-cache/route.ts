import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    // Revalidate the entire site
    revalidatePath("/", "layout");

    // Return a success response
    return NextResponse.json(
      {
        success: true,
        message: "Cache cleared successfully",
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error clearing cache:", error);

    // Return an error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to clear cache",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
