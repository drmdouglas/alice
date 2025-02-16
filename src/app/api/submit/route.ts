// app/api/results/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// File paths
const jsonFilePath = path.join(process.cwd(), "data", "average.json");
const csvFilePath = path.join(process.cwd(), "data", "log.csv");

// Function to read the JSON data from the file
const readDataFromFile = () => {
  try {
    const rawData = fs.readFileSync(jsonFilePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    return { totalSum: 0, requestCount: 0 }; // Default values if file doesn't exist
  }
};

// Function to write the updated data back to the JSON file
const writeDataToFile = (data: { totalSum: number; requestCount: number }) => {
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
};

// Function to log data to the CSV file with a timestamp
const logDataToCSV = (
  textnumber: number,
  studentname: string,
  average: number,
  roundnumber: number
) => {
  const timestamp = new Date().toISOString(); // Get current timestamp in ISO format
  const csvData = `${timestamp},${textnumber},${studentname},${average},${roundnumber}\n`;

  // Check if the file exists to write headers only if the file is new
  const fileExists = fs.existsSync(csvFilePath);
  if (!fileExists) {
    fs.appendFileSync(
      csvFilePath,
      "Timestamp,TextNumber,StudentName,Average,RoundNumber\n"
    ); // Write header
  }

  // Append the log entry to the CSV file
  fs.appendFileSync(csvFilePath, csvData);
};

export async function POST(req: NextRequest) {
  try {
    const { textnumber, studentname, roundNumber } = await req.json(); // Get the data from the request

    // Ensure textnumber is a number (parse it to an integer)
    const parsedNumber = parseInt(textnumber, 10);

    if (isNaN(parsedNumber)) {
      return NextResponse.json({ error: "Invalid number" }, { status: 400 });
    }

    // Read the current data from the file
    const data = readDataFromFile();

    // Update the sum and count
    data.totalSum += parsedNumber;
    data.requestCount += 1;

    // Calculate the average
    const average = data.totalSum / data.requestCount;

    // Write the updated data back to the file
    writeDataToFile(data);

    console.log(`Received textnumber: ${parsedNumber}`);
    console.log(`Received studentName: ${studentname}`);
    console.log(`Current average: ${average}`);

    // Log the data to the CSV file with timestamp
    logDataToCSV(parsedNumber, studentname, average, roundNumber);

    // Send back the response with the submitted number, average, and student name
    return NextResponse.json({
      textnumber: parsedNumber,
      studentName: studentname, // Include the student's name
      average, // Include the average
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
