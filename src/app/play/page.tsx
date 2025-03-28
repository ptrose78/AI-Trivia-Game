"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function TriviaGame() {
  const { user } = useUser();  
  const name = user?.fullName || user?.emailAddresses[0].emailAddress || "Anonymous";
  
  const [category, setCategory] = useState("Science");
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const totalQuestions = 5;
  const [playedToday, setPlayedToday] = useState(false);
  

  const checkIfPlayedToday = async () => {
    const res = await fetch("/api/checkPlay");
    const data = await res.json();
    setPlayedToday(data.playedToday);
    console.log("Played Today:", data.playedToday);
    return data.playedToday;
  };

  const fetchTrivia = async () => {
    if (await checkIfPlayedToday()) {
      console.log("You have already played today. Come back tomorrow!");
      return;
    }

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

    const data = await res.json();
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
    }, 1000);
  };

  const postScore = async () => {
    console.log("Posting score:", score);
    const res = await fetch("/api/postScore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score }),
    });
    redirect("/leaderboard");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Trivia Game</h2>
      {playedToday ? (
      <p>You have already played today. Come back tomorrow!</p>
        ) : (
        <>
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
              <button className="w-full text-left" key={index} onClick={() => handleAnswer(index)} disabled={!!feedback}>
                <li className="py-1">{`${choice}`}</li>
              </button>
            ))}
          </ul>
          {feedback && <p className="mt-3">{feedback}</p>}
        </div>
      )}

      {gameOver && (
        <button onClick={postScore} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Check Leaderboard
        </button>
      )}
      </>
      )}
    </div>
  );
}
