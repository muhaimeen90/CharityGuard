import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { address } = params;
    
    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }
    
    console.log(`Fetching user with wallet address: ${address}`);
    
    // Call your backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/wallet/${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store' // Disable caching for this request
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || "Unknown error" };
      }
      
      console.error("Error response from backend:", {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch user data" }, 
        { status: response.status }
      );
    }
    
    const userData = await response.json();
    console.log("User data fetched successfully:", userData.id);
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user by address:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}