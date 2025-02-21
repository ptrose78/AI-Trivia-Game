'use client'

import React, { useState } from "react";
import Link from "next/link";
import { SignInButton, SignOutButton, useUser} from "@clerk/nextjs";


const Navbar = () => {  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isSignedIn, user } = useUser();
 
  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <Link href="/" className="hover:text-gray-200">
            Trivia Master
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="space-x-6 hidden md:flex items-center">
          <Link
            href="/play"
            className="text-white hover:text-gray-200 transition duration-300"
          >
            Play
          </Link>
          <Link
            href="/leaderboard"
            className="text-white hover:text-gray-200 transition duration-300"
          >
            Leaderboard
          </Link>

          {isSignedIn ? (
            <div className="relative">
              {/* Profile Image Button */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={user?.imageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border"
                />
                <span className="text-white">{user?.firstName}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Profile
                  </Link>
                  <div className="block px-4 py-2 hover:bg-gray-200">
                    <SignOutButton />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="text-white hover:text-gray-200 transition duration-300"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-600 text-white py-4 px-6">
          <Link href="/play" className="block py-2 hover:text-gray-200">
            Play
          </Link>
          <Link
            href="/leaderboard"
            className="block py-2 hover:text-gray-200"
          >
            Leaderboard
          </Link>

          {isSignedIn ? (
            <>
              <Link href="/profile" className="block py-2 hover:text-gray-200">
                Profile
              </Link>
              <div className="block py-2 hover:text-gray-200">
              <SignOutButton />
              </div>
            </>
          ) : (
            <SignInButton>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-green-700 transition duration-300 ease-in-out">
              Log In
            </button>
            </SignInButton>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;