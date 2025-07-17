import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="mt-6 inline-block px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
        Return to Home
      </Link>
    </div>
  );
}