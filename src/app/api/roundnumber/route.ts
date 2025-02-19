import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// File path to store the round number
const roundFilePath = path.join(process.cwd(), "data", "round.json");

// Function to read the current round number from the file
const readRoundFromFile = () => {
  try {
    const rawData = fs.readFileSync(roundFilePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    // If the file doesn't exist or has an error, initialize round to 1
    return { round: 1 };
  }
};

// Function to write the updated round number back to the file
const writeRoundToFile = (round: number) => {
  fs.writeFileSync(roundFilePath, JSON.stringify({ round }, null, 2));
};

export async function GET(req: NextRequest) {
  try {
    // Read the current round number from the file
    const data = readRoundFromFile();

    // Send back the current round number
    return NextResponse.json({ round: data.round });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching the round number" },
      { status: 500 }
    );
  }
}

// POST handler to increment the round number
export async function POST(req: NextRequest) {
  try {
    // Read the current round number from the file
    const data = readRoundFromFile();

    // Increment the round number
    const newRound = data.round + 1;

    // Write the updated round number back to the file
    writeRoundToFile(newRound);

    // Return the updated round number
    return NextResponse.json({ round: newRound });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while incrementing the round number" },
      { status: 500 }
    );
  }
}
