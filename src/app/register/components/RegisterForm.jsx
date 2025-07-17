// app/register/components/RegisterForm.jsx
"use client";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth/registerUser";
import { signIn } from "next-auth/react";
import SocialLogin from "@/app/login/components/SocialLogin";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    const payload = { name, email, password };

    const response = await registerUser(payload);
    console.log("client side: register user response--->", response);

    if (response.acknowledged === true) {
      toast.success(`${response?.message} ✅`, { position: "top-center" });
      form.reset(); // Clear the form

      // Automatically log in the user after registration
      const signInResponse = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });

      if (signInResponse?.ok) {
        toast.success("Logged in successfully!", { position: "top-center" });
        router.push("/"); // Redirect to home page
      } else {
        toast.error("Auto-login failed. Please log in manually.", { position: "top-center" });
        router.push("/login");
      }
    } else {
      toast.error(response.message || "Registration failed ❌", { position: "top-center" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-8 border border-gray-300 p-4 rounded-lg shadow mx-auto"
    >
      <label className="form-control w-full">
        <div className="label w-full">
          <span className="label-text text-black my-2 font-semibold">Name</span>
        </div>
        <input
          type="text"
          placeholder="Enter your name"
          className="input input-bordered w-full"
          name="name"
          required
        />
      </label>

      <label className="form-control w-full">
        <div className="label w-full">
          <span className="label-text text-black my-2 font-semibold">Email</span>
        </div>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="input input-bordered w-full"
          required
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
          required
        />
      </label>

      <button className="w-full h-12 font-bold hover:bg-slate-800 hover:text-white rounded-lg my-4 bg-white text-black border border-gray-300 hover:border hover:border-slate-800 transition-colors duration-300 cursor-pointer">
        Sign Up
      </button>

      <p className="text-center">Or Sign In with</p>
      <SocialLogin />
      <p className="text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-slate-800 hover:underline font-semibold">
          Login
        </Link>
      </p>
    </form>
  );
}