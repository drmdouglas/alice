import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// File path to the CSV file
const csvFilePath = path.join(process.cwd(), "data", "log.csv");

// Helper function to read CSV data
const readCSVData = () => {
  try {
    const rawData = fs.readFileSync(csvFilePath, "utf8");
    const lines = rawData.split("\n").filter((line) => line.trim() !== ""); // Split into lines and remove empty lines
    const headers = lines[0].split(","); // Assuming the first line is the header
    const records = lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((acc, header, index) => {
        acc[header] = values[index]; // Create an object for each record
        return acc;
      }, {} as { [key: string]: string });
    });
    return records;
  } catch (error) {
    return [];
  }
};

// GET handler for fetching round average and closest student
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const roundNumber = url.searchParams.get("roundNumber");

    // Validate if roundNumber is provided
    if (!roundNumber) {
      return NextResponse.json(
        { error: "Missing roundNumber parameter" },
        { status: 400 }
      );
    }

    // Read data from the CSV file
    const records = readCSVData();

    // Filter records for the requested round number
    const roundRecords = records.filter(
      (record) => record.RoundNumber === roundNumber
    );

    // If no data is found for the given round
    if (roundRecords.length === 0) {
      return NextResponse.json(
        { error: "No data for the given round" },
        { status: 404 }
      );
    }

    // Calculate the total of TextNumbers for the round
    const totalTextNumber = roundRecords.reduce(
      (sum, record) => sum + parseFloat(record.TextNumber),
      0
    );
    const roundAverage = totalTextNumber / roundRecords.length;

    // Calculate 70% of the round average
    const targetPercentage = 0.7 * roundAverage;

    // Find the student whose TextNumber is closest to 70% of the round average
    let closestStudent = null;
    let smallestDifference = Infinity;

    roundRecords.forEach((record) => {
      const studentTextNumber = parseFloat(record.TextNumber);
      const difference = Math.abs(studentTextNumber - targetPercentage);

      // Update the closest student if the current student's difference is smaller
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestStudent = record.StudentName;
      }
    });

    // Return the calculated data
    return NextResponse.json({
      roundNumber,
      roundAverage,
      closestStudent,
      targetPercentage,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
