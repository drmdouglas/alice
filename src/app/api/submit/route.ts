import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// File path to the CSV file
const csvFilePath = path.join(process.cwd(), "data", "log.csv");

// Helper function to check if the CSV file exists
const fileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

// Helper function to create CSV header if file doesn't exist
const createCSVHeader = (filePath: string) => {
  const header = "RoundNumber,StudentName,TextNumber"; // Define the header format without Average
  fs.writeFileSync(filePath, header + "\n"); // Write the header to the file
};

// Helper function to append a new record to the CSV file
const appendCSVData = (data: string) => {
  try {
    fs.appendFileSync(csvFilePath, data + "\n");
  } catch (error) {
    console.error("Error writing to CSV file:", error);
  }
};

// POST handler for submitting data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { textnumber, studentname, roundNumber } = body;

    // Validate input data
    if (!textnumber || !studentname || !roundNumber) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: textnumber, studentname, or roundNumber",
        },
        { status: 400 }
      );
    }

    // Check if the CSV file exists, and if not, create the header
    if (!fileExists(csvFilePath)) {
      createCSVHeader(csvFilePath);
    }

    // Prepare the new record as a CSV line without "Average"
    const newRecord = `${roundNumber},${studentname},${textnumber}`;

    // Append the new record to the CSV file
    appendCSVData(newRecord);

    return NextResponse.json(
      { message: "Record added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
