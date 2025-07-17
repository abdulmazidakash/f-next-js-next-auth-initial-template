"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
    role: "user",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        password: "",
        image: session.user.image || null,
        role: session.user.role || "user",
      });
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    let imageUrl = formData.image;
    if (imageFile) {
      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: formDataToSend,
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

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
      image: imageUrl,
      role: formData.role,
    };

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, userId: session.user.id }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Profile updated successfully!", { position: "top-center" });
        // Update session data
        session.user.name = formData.name;
        session.user.email = formData.email;
        session.user.image = imageUrl;
        session.user.role = formData.role;
      } else {
        toast.error(result.message || "Failed to update profile", { position: "top-center" });
      }
    } catch (error) {
      toast.error("Failed to update profile", { position: "top-center" });
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center my-8">User Profile</h1>
        <div className="w-full max-w-md space-y-8 border border-gray-300 p-4 rounded-lg shadow mx-auto">
          {formData.image && (
            <div className="flex justify-center">
              <img
                src={formData.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="form-control w-full">
              <div className="label w-full">
                <span className="label-text text-black my-2 font-semibold">Name</span>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="input input-bordered w-full"
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input input-bordered w-full"
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label w-full">
                <span className="label-text text-black my-2 font-semibold">Password (leave blank to keep unchanged)</span>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="input input-bordered w-full"
              />
            </label>

            <label className="form-control w-full">
              <div className="label w-full">
                <span className="label-text text-black my-2 font-semibold">Profile Image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="input input-bordered w-full"
              />
            </label>

            <label className="form-control w-full">
              <div className="label w-full">
                <span className="label-text text-black my-2 font-semibold">Role</span>
              </div>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter role"
                className="input input-bordered w-full"
                disabled // Disable role editing for now
              />
            </label>

            <button className="w-full h-12 font-bold hover:bg-slate-800 hover:text-white rounded-lg my-4 bg-white text-black border border-gray-300 hover:border hover:border-slate-800 transition-colors duration-300 cursor-pointer">
              Update Profile
            </button>
          </form>
          <p className="text-center">
            <Link href="/" className="text-slate-800 hover:underline font-semibold">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}