"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, FormEvent } from "react";
import Link from "next/link";

const Signin = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { isLoaded, signIn, setActive } = useSignIn();
  const [clerkError, setClerkError] = useState("");
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const signInWithEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    const emailAddress = user.email;
    const password = user.password;

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.log(result);
      }
    } catch (err) {
      if (err instanceof Error) {
        setClerkError(err.message);
      } else {
        setClerkError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="p-10 flex justify-center">
      <div className="bg-slate-700 w-[600px] p-10 flex flex-col justify-center items-center gap-10 shadow-lg shadow-slate-500 rounded-lg">
        <h1 className="sm:text-3xl text-xl font-bold text-white bg-black px-4 py-2 rounded-xl shadow-md shadow-slate-400">
          SIGNIN
        </h1>
        <form
          onSubmit={signInWithEmail}
          className="flex flex-col gap-7 text-black w-full"
        >
          <div>
            <Input
              type="text"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>
          <div>
            <Input
              type="text"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <div id="clerk-captcha"></div>
          <Button type="submit">Submit</Button>
        </form>
        <p className="text-orange-500 text-bold">
          Create an account?{" "}
          <Link href="/sign-up" className="text-white">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
