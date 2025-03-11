"use client";

import { useState } from "react";

export default function TriviaGame() {
  const [category, setCategory] = useState("Science");
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTrivia = async () => {
    setLoading(true);
    setQuestion("");
    setChoices([]);
    setAnswer("");

    const res = await fetch("/api/getTrivia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.triviaQuestion) {
      const trivia = JSON.parse(data.triviaQuestion); // Parse JSON response
      setQuestion(trivia.question);
      setChoices(trivia.choices);
      setAnswer(trivia.answer);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Trivia Game</h2>
      
      <label className="block mb-4">
        Choose Category:
        <select
          className="ml-2 p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Science</option>
          <option>History</option>
          <option>Geography</option>
          <option>Entertainment</option>
        </select>
      </label>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={fetchTrivia}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Question"}
      </button>

      {question && (
        <div className="mt-6">
          <p className="text-lg font-semibold">{question}</p>
          <ul className="mt-3">
            {choices.map((choice, index) => (
              <li key={index} className="py-1">
                {`${choice}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
