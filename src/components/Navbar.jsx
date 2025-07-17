//src/components/Navbar.jsx

'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSchoolFlag } from "react-icons/fa6";
import { usePathname } from 'next/navigation';


export default function Navbar() {
const pathname = usePathname();

  const { data: session, status } = useSession();
  console.log('navbar session --->', session);

  const navMenu = () => (
  <>
    <li>
      <Link
        href="/"
        className={pathname === "/" ? "text-button-bg font-bold underline" : ""}
      >
        Home
      </Link>
    </li>
    <li>
      <Link
        href="/about"
        className={pathname === "/about" ? "text-button-bg font-bold underline" : ""}
      >
        About
      </Link>
    </li>
    <li>
      <Link
        href="/contact"
        className={pathname === "/contact" ? "text-button-bg font-bold underline" : ""}
      >
        Contact
      </Link>
    </li>
    <li>
      <Link
        href="/register"
        className={pathname === "/register" ? "text-button-bg font-bold underline" : ""}
      >
        Register
      </Link>
    </li>
    <li>
      <Link
        href="/login"
        className={pathname === "/login" ? "text-button-bg font-bold underline" : ""}
      >
        Login
      </Link>
    </li>
  </>
);


  return (
    <div className="navbar w-11/12 mx-auto py-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"/>
            </svg>
          </div>
          <ul tabIndex={0}
              className="menu font-semibold menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            {navMenu()}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-button-bg text-2xl">
		<FaSchoolFlag />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex font-semibold">
        <ul className="menu menu-horizontal px-1">
          {navMenu()}
        </ul>
      </div>

      <div className="navbar-end">
        {status === "loading" ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : status === "authenticated" ? (
          <div className="flex items-center list-none gap-2">
            <Link href="/profile">
              <Image
                title={session?.user?.name}
                src={session?.user?.image || "/assets/default-avatar.png"}
                width={40}
                height={40}
                alt="user-logo"
                className="rounded-full border border-gray-300 transition-all duration-200 cursor-pointer"
                priority
              />
            </Link>
            <li onClick={() => signOut()} className="btn mr-2">
              Logout
            </li>
          </div>
        ) : (
          <Link href="/login" className="btn mr-2">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}