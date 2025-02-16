// app/api/roundnumber/route.ts
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
    // If the file doesn't exist, initialize round to 1
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

    // Increment the round number
    const newRound = data.round + 1;

    // Write the updated round number back to the file
    writeRoundToFile(newRound);

    // Send back the updated round number
    return NextResponse.json({ round: newRound });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
