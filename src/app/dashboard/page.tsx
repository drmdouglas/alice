"use client";

import { useState } from "react";

const Dashboard = () => {
  const [roundNumber, setRoundNumber] = useState<string>("");
  const [roundAverage, setRoundAverage] = useState<number | null>(null);
  const [closestStudent, setClosestStudent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetAverage = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/results/rounds?roundNumber=${roundNumber}`
      );
      const data = await response.json();

      if (response.ok) {
        setRoundAverage(data.roundAverage); // Set the round average
        setClosestStudent(data.closestStudent); // Set the closest student
        setError(null);
      } else {
        setError(data.error || "Unknown error");
        setRoundAverage(null); // Reset round average if error occurs
        setClosestStudent(null); // Reset closest student if error occurs
      }
    } catch (err) {
      setError("Failed to fetch data.");
      setRoundAverage(null);
      setClosestStudent(null); // Reset closest student if error occurs
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-lg mx-auto bg-white rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Round Average Dashboard
      </h1>
      <div className="flex flex-col items-center gap-4 mb-8">
        <label htmlFor="roundNumber" className="text-lg text-gray-600">
          Enter Round Number:
        </label>
        <input
          type="text"
          id="roundNumber"
          value={roundNumber}
          onChange={(e) => setRoundNumber(e.target.value)}
          className="px-4 py-2 text-lg border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none w-full max-w-xs"
        />
        <button
          onClick={handleGetAverage}
          className="px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Average"}
        </button>
      </div>

      {error && <p className="text-red-500 text-lg mt-4">{error}</p>}
      {roundAverage !== null && !error && (
        <div className="text-center mt-8">
          <h3 className="text-xl text-gray-700">
            Round Average for Round {roundNumber}:
          </h3>
          <p className="text-3xl font-bold text-green-500">{roundAverage}</p>
        </div>
      )}

      {closestStudent && !error && (
        <div className="mt-8 text-center">
          <h3 className="text-xl text-gray-700">
            Closest Student to 70% of Round Average:
          </h3>
          <p className="text-2xl font-semibold text-blue-500">
            {closestStudent}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
