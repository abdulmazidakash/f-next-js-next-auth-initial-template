//app/login/components/LoginForm.jsx

"use client";
import React from "react";
import { signIn, useSession } from "next-auth/react"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SocialLogin from "./SocialLogin";


export default function LoginForm() {
  const session = useSession();
  console.log('login form use session--->', session);
  const router = useRouter();
  const pathname = usePathname();
  console.log('pathname---->',pathname);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    toast('submitting........')

	try{
		const response = await signIn('credentials', {email, password, callbackUrl: '/', redirect: false});

		console.log(email, password);
		console.log('response--->', response);
    if(response.ok){
      toast.success(`Logged in successfully as ${email}`, { duration: 2000 });
      router.push('/');
      form.reset();
    }else{
      toast.error('Failed to login')
    }

	}catch(error){
		// alert('authentication failed')
    console.log(error);
    toast.error('Failed to login')

	}
  };
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8 border border-gray-300 p-4 rounded-lg shadow mx-auto">
      <label className="form-control w-full">
        <div className="label w-full">
          <span className="label-text  text-black my-2 font-semibold">Email</span>
        </div>
        <input
          type="text"
          name="email"
          placeholder="enter your email"
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
          placeholder="enter your password"
          className="input input-bordered w-full"
        />
      </label>
      <button className="w-full h-12 font-bold hover:bg-slate-800 hover:text-white rounded-lg my-4 bg-white text-black border border-gray-300 hover:border hover:border-slate-800 transition-colors duration-300 cursor-pointer">
        Sign In
      </button>
      <p className="text-center">Or Sign In with</p>
      <SocialLogin />
      <p className="text-center">
        Already have an account?{" "}
        <Link href="/register" className="text-slate-800 hover:underline font-semibold">
          Register
        </Link>
      </p>
    </form>
  );
}