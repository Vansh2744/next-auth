"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";

function Navbar() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (user) {
          const email = user?.primaryEmailAddress?.emailAddress;
          const res = await axios.get(`/api/getProfile?email=${email}`);

          if (res.data?.user?.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    getUser();
  }, [user]);

  return (
    <div>
      <nav className="bg-slate-700 px-10 py-5 sm:visible hidden sm:block">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-orange-600 px-4 py-1 rounded-full shadow-md shadow-orange-400"
          >
            E-COM
          </Link>
          <div className="flex gap-4 font-bold text-lg">
            <Link href="/">Home</Link>
            <Link
              href={{
                pathname: "/Category",
                query: {
                  category: "Electronics",
                },
              }}
            >
              Electronics
            </Link>
            <Link
              href={{
                pathname: "/Category",
                query: {
                  category: "Beauty",
                },
              }}
            >
              Beauty
            </Link>
            <Link
              href={{
                pathname: "/Category",
                query: {
                  category: "Fashion",
                },
              }}
            >
              Fashion
            </Link>
          </div>
          <div className="flex gap-5">
            <SignedIn>
              {isAdmin && (
                <Link
                  href="/dashboard/adminDashboard"
                  className="bg-orange-600 px-4 py-1 rounded-full hover:bg-slate-500"
                >
                  Dashboard
                </Link>
              )}
              {!isAdmin && (
                <div className="flex gap-5 font-bold text-lg">
                  <Link href="/cart">Cart</Link>
                  <Link href="/wishlist">Wishlist</Link>
                  <Link href="/order">Orders</Link>
                </div>
              )}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="bg-orange-600 px-4 py-1 rounded-full hover:bg-slate-500"
              >
                Signin
              </Link>
              <Link
                href="/sign-up"
                className="bg-orange-600 px-4 py-1 rounded-full hover:bg-slate-500"
              >
                Signup
              </Link>
            </SignedOut>
          </div>
        </div>
      </nav>
      <div className="navbar bg-base-100 sm:hidden visible">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link
                  href={{
                    pathname: "/Category",
                    query: {
                      category: "Electronics",
                    },
                  }}
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href={{
                    pathname: "/Category",
                    query: {
                      category: "Beauty",
                    },
                  }}
                >
                  Beauty
                </Link>
              </li>
              <li>
                <Link
                  href={{
                    pathname: "/Category",
                    query: {
                      category: "Fashion",
                    },
                  }}
                >
                  Fashion
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <Link href="/" className="btn btn-ghost text-lg">
            E-COM
          </Link>
        </div>
        <div className="flex gap-5 ml-2">
          <SignedIn>
            {isAdmin && (
              <Link
                href="/dashboard/adminDashboard"
                className="bg-orange-600 sm:px-4 px-3 sm:py-1 rounded-full hover:bg-slate-500"
              >
                Dashboard
              </Link>
            )}
            {!isAdmin && (
              <div className="flex gap-5 font-bold text-lg">
                <Link href="/cart">Cart</Link>
                <Link href="/wishlist">Wishlist</Link>
                <Link href="/order">Orders</Link>
              </div>
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="bg-orange-600 sm:px-4 px-3 sm:py-1 rounded-full hover:bg-slate-500"
            >
              Signin
            </Link>
            <Link
              href="/sign-up"
              className="bg-orange-600 sm:px-4 px-3 sm:py-1 rounded-full hover:bg-slate-500"
            >
              Signup
            </Link>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
