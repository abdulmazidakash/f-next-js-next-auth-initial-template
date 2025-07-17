"use client";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth/registerUser";
import SocialLogin from "@/app/login/components/SocialLogin";
import { useRouter } from "next/navigation";

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
	console.log('register response--->', response);
    
    if (response.acknowledged === true) {
      alert(`${response?.message} ✅`, { position: "top-center" });
      form.reset(); // Clear the form
	  router.push('/')
    } else {
      alert(response.message || "Registration failed ❌", { position: "top-center" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-8">
      <label className="form-control w-full">
        <div className="label w-full">
          <span className="label-text font-bold">Name</span>
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
          <span className="label-text font-bold">Email</span>
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
          <span className="label-text font-bold">Password</span>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="input input-bordered w-full"
          required
        />
      </label>

      {/* <button type="submit" className="w-full h-12 bg-orange-500 text-white font-bold">
       
      </button> */}
	  <button className="btn btn-outline btn-success w-full"> Sign Up</button>

      <p className="text-center">Or Sign In with</p>
      <SocialLogin />
      <p className="text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-orange-500 font-bold">
          Login
        </Link>
      </p>
    </form>
  );
}