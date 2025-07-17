"use client";
import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SocialLogin from "./SocialLogin";
import Loader from "@/components/Loader";

export default function LoginForm() {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    toast("Submitting...");

    try {
      const response = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });

      if (response.ok) {
        toast.success(`Logged in successfully as ${email}`, { duration: 2000 });
        router.push("/");
        form.reset();
      } else {
        toast.error("Failed to login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to login");
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-8 border border-gray-300 p-4 rounded-lg shadow mx-auto"
      >
        <label className="form-control w-full">
          <div className="label w-full">
            <span className="label-text text-black my-2 font-semibold">Email</span>
          </div>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
          />
        </label>
        <label className="form-control w-full">
          <div className="label w-full">
            <span className="label-text text-black my-2 font-semibold">Password</span>
          </div>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="input input-bordered w-full"
          />
        </label>
        <button className="w-full h-12 font-bold hover:bg-slate-800 hover:text-white rounded-lg my-4 bg-white text-black border border-gray-300 hover:border hover:border-slate-800 transition-colors duration-300 cursor-pointer">
          Sign In
        </button>
        <p className="text-center">Or Sign In with</p>
        <SocialLogin />
        <p className="text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-slate-800 hover:underline font-semibold">
            Register
          </Link>
        </p>
      </form>
    </>
  );
}