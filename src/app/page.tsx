// app/page.tsx
"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [studentName, setStudentName] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [average, setAverage] = useState<number | null>(null);
  const [round, setRound] = useState<number | null>(null); // State to store round number

  // Fetch the round number when the component mounts
  useEffect(() => {
    const fetchRoundNumber = async () => {
      const res = await fetch("/api/roundnumber");
      const data = await res.json();
      if (data.round) {
        setRound(data.round); // Set the round number
      } else {
        console.error("Failed to fetch round number");
      }
    };

    fetchRoundNumber();
  }, []); // Empty dependency array to call once when the component mounts

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the input is a valid number
    const numberValue = parseInt(inputValue, 10);

    if (isNaN(numberValue)) {
      alert("Please enter a valid number.");
      return;
    }

    const res = await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify({
        textnumber: numberValue, // Send as a number
        studentname: studentName,
        roundNumber: round,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error); // Handle errors from the backend (like invalid data)
    } else {
      setResponse(data.textnumber); // Display the submitted number
      setAverage(data.average); // Display the calculated average
    }
  };

  return (
    <main className="m-[25%] p-5 mx-[10%] text-slate-700 bg-zinc-300">
      <h1 className="m-5 text-center">
        Round <span id="round">{round ?? "Loading..."}</span>
      </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="studentname"
            id="studentname"
            placeholder="Enter your Name"
            value={studentName}
            onChange={handleNameChange}
            required
            className="bg-slate-300 text-blue-600"
          />
        </label>
        <br />
        <label>
          Enter a Number (0-100):
          <input
            type="number"
            name="textnumber"
            id="textnumber"
            value={inputValue}
            onChange={handleInputChange}
            min="0"
            max="100"
            placeholder="Enter an integer"
            className="bg-slate-300 text-blue-600"
          />
        </label>
        <br />
        <input
          type="submit"
          value="Click to Submit"
          className="bg-slate-300 text-blue-600 m-5 rounded-lg p-5"
        />
      </form>

      {response && <p>You Submitted: {response}</p>}
      {average !== null && <p>Current Average: {average}</p>}
    </main>
  );
}
