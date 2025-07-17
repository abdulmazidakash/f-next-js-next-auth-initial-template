// app/login/components/SocialLogin.jsx
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SocialLogin() {
  const router = useRouter();
  const session = useSession();

  const handleSocialLogin = async (providerName) => {
    const toastId = toast.loading(`Signing in with ${providerName}...`);
    try {
      const result = await signIn(providerName, { callbackUrl: '/' }, {redirect: false});

      if (result?.error) {
        toast.error(`Failed to sign in with ${providerName}: ${result.error}`, { id: toastId });
      } else if (result?.ok) {
        toast.success(`Logged in successfully with ${providerName}!`, { id: toastId });
      }
    } catch (error) {
      console.error("Social login error:", error);
      toast.error("An unexpected error occurred during social login.", { id: toastId });
    }
  };

  useEffect(() => {
    if (session?.status === 'authenticated') {
      if (router.pathname !== '/') {
        router.push('/');
        toast.success(`Logged in successfully as ${session?.data?.user?.email}`, { duration: 2000 });
      }
    }
  }, [session?.status, router]);

  return (
    <div className="flex gap-4 items-center justify-center">
      {/* GitHub */}
      <button
        onClick={() => handleSocialLogin('github')}
        className="btn text-2xl rounded-full p-2 shadow"
      >
        <FaGithub />
      </button>

      {/* Google */}
      <button
        onClick={() => handleSocialLogin('google')}
        className="btn text-2xl rounded-full p-2 shadow"
      >
        <FcGoogle />
      </button>
    </div>
  );
}