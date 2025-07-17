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
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-8">
      <label className="form-control w-full">
        <div className="label w-full">
          <span className="label-text  font-bold">Email</span>
        </div>
        <input
          type="text"
          name="email"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
      </label>
      <label className="form-control w-full">
        <div className="label w-full">
          <span className="label-text font-bold">Password</span>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
      </label>
      <button className="w-full h-12 bg-orange-500 text-white font-bold">
        Sign In
      </button>
      <p className="text-center">Or Sign In with</p>
      <SocialLogin />
      <p className="text-center">
        Already have an account?{" "}
        <Link href="/register" className="text-orange-500 font-bold">
          Register
        </Link>
      </p>
    </form>
  );
}