import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { address } = params;
    
    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }
    
    // Call your backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/by-wallet/${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch user data" }, 
        { status: response.status }
      );
    }
    
    const userData = await response.json();
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user by address:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}