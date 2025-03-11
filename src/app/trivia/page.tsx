"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function TriviaGame() {
  const { user } = useUser();  
  const name = user?.fullName || user?.emailAddresses[0].emailAddress || "Anonymous";
  console.log(name);
  
  const [category, setCategory] = useState("Science");
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const totalQuestions = 3;

  const fetchTrivia = async () => {

    setLoading(true);
    setQuestion("");
    setChoices([]);
    setAnswer("");
    setFeedback("");
    setGameOver(false);

    const res = await fetch("/api/getTrivia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });

    console.log("API Response:", res);
    const data = await res.json();
    console.log("API Response:", data);
    setLoading(false);

    if (data.triviaQuestion) {
      console.log("Trivia Question:", data.triviaQuestion);
      const triviaText = data.triviaQuestion.trim(); 
      const triviaJson = triviaText.replace(/^```json|```$/g, "").trim();
      const trivia = JSON.parse(triviaJson);
      setQuestion(trivia.question);
      setChoices(trivia.choices);
      setAnswer(trivia.answer);
      setQuestionCount((prev) => prev + 1);
    }
  };

  const handleAnswer = (index: number) => {
    const convertedChoice = String.fromCharCode(65 + index);
    console.log("Converted Choice:", convertedChoice);
    console.log("Answer:", answer);

    if (convertedChoice === answer) {
      setFeedback("✅ Correct answer!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback("❌ Incorrect answer.");
    }

    setTimeout(() => {
      if (questionCount < totalQuestions) {
        fetchTrivia();
      } else {
        setFeedback(`🎉 Quiz Complete! Your Score: ${score}/${totalQuestions}`);
        setGameOver(true);
      }
    }, 2000);
  };

  const postScore = async () => {
    console.log("Posting score:", score);
    const res = await fetch("/api/postScore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score }),
    });
    const data = await res.json();
    console.log("Post Score Response:", data);
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
        {loading ? "Loading..." : questionCount === totalQuestions ? "Restart Quiz" : "Get Question"}
      </button>

      {question && (
        <div className="mt-6">
          <p className="text-lg font-semibold">{question}</p>
          <ul className="mt-3">
            {choices.map((choice, index) => (
              <button key={index} onClick={() => handleAnswer(index)} disabled={!!feedback}>
                <li className="py-1">{`${choice}`}</li>
              </button>
            ))}
          </ul>
          {feedback && <p className="mt-3">{feedback}</p>}
        </div>
      )}

      {gameOver && (
        <button onClick={postScore} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Post Score
        </button>
      )}
    </div>
  );
}
