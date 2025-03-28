import Link from "next/link";
import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 text-center space-y-8">
      {/* Authentication buttons */}
      <div className="absolute top-6 right-6 flex gap-4">
        <SignedOut>
          <SignInButton forceRedirectUrl="/play">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-green-700 transition duration-300 ease-in-out">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-purple-700 transition duration-300 ease-in-out">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
      </div>

      {/* Main Content */}
      <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mt-6">
        Welcome to Trivia Master!
      </h1>
      <p className="text-lg text-gray-600 mt-2 max-w-lg mx-auto">
        Test your knowledge and challenge your friends in this fun daily trivia game.
      </p>

      <div className="mt-6 flex gap-6 flex-col sm:flex-row items-center justify-center">
        <Link
          href="/play"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-medium hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Play Now
        </Link>
        <Link
          href="/leaderboard"
          className="bg-gray-300 text-black px-8 py-3 rounded-lg text-xl font-medium hover:bg-gray-400 transition duration-300 ease-in-out mt-4 sm:mt-0"
        >
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}
