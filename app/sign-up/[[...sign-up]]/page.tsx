"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReactCodeInput from "react-code-input";
import toast from "react-hot-toast";

const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [code, setCode] = useState("");
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (signedUp) {
      toast.success("Account Created Successfully");
    }
  }, [signedUp]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const signUpWithEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName: user.firstname,
        lastName: user.lastname,
        username: user.username,
        emailAddress: user.email,
        password: user.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerifying(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await axios.post("/api/createUser", {
          firstname: completeSignUp.firstName,
          lastname: completeSignUp.lastName,
          username: completeSignUp.username,
          email: completeSignUp.emailAddress,
        });
        setSignedUp(true);
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err) {
      console.log("Error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      <div className="p-10 flex justify-center">
        {!verifying ? (
          <div className="bg-slate-700 w-[600px] p-10 flex flex-col justify-center items-center gap-10 shadow-lg shadow-slate-500 rounded-lg">
            <h1 className="sm:text-3xl text-xl font-bold text-white bg-black px-4 py-2 rounded-xl shadow-md shadow-slate-400">
              SIGNUP
            </h1>
            <form
              onSubmit={signUpWithEmail}
              className="flex flex-col gap-7 text-black w-full"
            >
              <div>
                <Input
                  type="text"
                  name="firstname"
                  value={user.firstname}
                  onChange={handleChange}
                  placeholder="First name"
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="lastname"
                  value={user.lastname}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  placeholder="Username"
                />
              </div>
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
              Already have an account?{" "}
              <Link href="/sign-in" className="text-white">
                Signin
              </Link>
            </p>
          </div>
        ) : (
          <div>
            <form onSubmit={handleVerify}>
              <div>
                <ReactCodeInput
                  type="text"
                  name="code"
                  fields={6}
                  value={code}
                  onChange={(value) => setCode(value)}
                  inputMode="numeric"
                />
              </div>
              <div id="clerk-captcha"></div>
              <Button type="submit">Verify</Button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Signup;
