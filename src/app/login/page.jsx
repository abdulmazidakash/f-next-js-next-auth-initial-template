
import Image from "next/image";

import React from "react";

import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-8">Login</h1>
      <section className="container mx-auto">
    

        {/* Right Section */}
        <div className="col-span-12 md:col-span-6 flex justify-center items-center">
          <LoginForm />
        </div>
      </section>
    </>
  );
}
