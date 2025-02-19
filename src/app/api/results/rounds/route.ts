import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// File path
const csvFilePath = path.join(process.cwd(), "data", "log.csv");

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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const roundNumber = url.searchParams.get("roundNumber");

    if (!roundNumber) {
      return NextResponse.json(
        { error: "Missing roundNumber parameter" },
        { status: 400 }
      );
    }

    const records = readCSVData();
    const roundRecords = records.filter(
      (record) => record.RoundNumber === roundNumber
    );

    if (roundRecords.length === 0) {
      return NextResponse.json(
        { error: "No data for the given round" },
        { status: 404 }
      );
    }

    // Calculate the average of TextNumbers for the given round
    const totalTextNumber = roundRecords.reduce(
      (sum, record) => sum + parseFloat(record.TextNumber),
      0
    );
    const roundAverage = totalTextNumber / roundRecords.length;

    // Calculate 70% of the round average
    const targetPercentage = 0.7 * roundAverage;

    // Find the student whose average is closest to 70% of the round average
    let closestStudent = null;
    let smallestDifference = Infinity;

    roundRecords.forEach((record) => {
      const studentAverage = parseFloat(record.Average);
      const difference = Math.abs(studentAverage - targetPercentage);

      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestStudent = record.StudentName;
      }
    });

    return NextResponse.json({
      roundNumber,
      roundAverage,
      count: roundRecords.length,
      closestStudent,
      targetPercentage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
