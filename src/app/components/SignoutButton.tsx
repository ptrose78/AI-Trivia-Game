'use client'

import { useClerk } from '@clerk/nextjs'
import Link from 'next/link'

export const SignOutButton = () => {
  const { signOut } = useClerk()

  return (
    // Clicking this button signs out a user and redirects them to the home page
    <Link href="/sign-in"><button className="block px-4 py-2 hover:bg-gray-100">Sign out</button></Link>
  )
}