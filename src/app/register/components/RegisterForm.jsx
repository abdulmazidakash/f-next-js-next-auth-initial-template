"use client";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth/registerUser";
import { signIn } from "next-auth/react";
import SocialLogin from "@/app/login/components/SocialLogin";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "@/components/Loader";

export default function RegisterForm() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    // Optional: basic password check
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", { position: "top-center" });
      setIsLoading(false);
      return;
    }

    // Handle image upload to imgbb
    let imageUrl = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (data.success) {
          imageUrl = data.data.url;
        } else {
          toast.error("Image upload failed", { position: "top-center" });
          setIsLoading(false);
          return;
        }
      } catch (error) {
        toast.error("Image upload error", { position: "top-center" });
        setIsLoading(false);
        return;
      }
    }

    // Register user
    const payload = { name, email, password, image: imageUrl };
    const response = await registerUser(payload);

    if (response.acknowledged === true) {
      toast.success(`${response?.message} ✅`, { position: "top-center" });
      form.reset();
      setImageFile(null);

      // Auto sign in after registration
      const signInResponse = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });

      if (signInResponse?.ok) {
        toast.success("Logged in successfully!", { position: "top-center" });
        router.push("/");
      } else {
        toast.error("Auto-login failed. Please log in manually.", { position: "top-center" });
        router.push("/login");
      }
    } else {
      toast.error(response.message || "Registration failed ❌", { position: "top-center" });
    }

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 border border-gray-300 p-6 rounded-lg shadow mx-auto bg-white"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>

        <label className="form-control w-full">
          <span className="label-text text-black font-semibold mb-1">Name</span>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="input input-bordered w-full"
            required
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text text-black font-semibold mb-1">Email</span>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            required
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text text-black font-semibold mb-1">Password</span>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="input input-bordered w-full"
            required
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text text-black font-semibold mb-1">Profile Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="file-input file-input-bordered w-full"
          />
        </label>

        <button
          type="submit"
          className="w-full h-12 font-bold rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-600">Or sign up with</p>
        <SocialLogin />

        <p className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-slate-800 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </form>
    </>
  );
}
