"use client";
import { useRouter } from "next/navigation";

export default function CheckoutError() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 pt-26 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          Unable to load the order. Please try again later.
        </p>
        <button
          onClick={() => router.push("/cart")}
          className="px-6 cursor-pointer py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
