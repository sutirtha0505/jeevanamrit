import { NextRequest, NextResponse } from "next/server";
import { generateHerbLocations } from "@/app/ai/flows/generate-herb-locations";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { commonName, latinName, currentWeather, currentLocation } = body;

    // Validate required fields
    if (!commonName) {
      return NextResponse.json(
        { error: "commonName is required" },
        { status: 400 }
      );
    }

    // Call the Genkit flow to generate locations
    const result = await generateHerbLocations({
      commonName,
      latinName,
      currentWeather,
      currentLocation,
    });

    // Return the generated locations
    return NextResponse.json({
      success: true,
      locations: result.locations,
    });
  } catch (error) {
    console.error("Error generating herb locations:", error);
    return NextResponse.json(
      {
        error: "Failed to generate herb locations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
