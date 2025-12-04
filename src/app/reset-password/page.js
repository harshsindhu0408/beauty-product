import React, { Suspense } from "react";
import ResetPasswordPageClient from "@/pages/ResetPasswordPageClient";

// This can be a server component
const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordPageClient />
    </Suspense>
  );
};

// Loading component for Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen pt-10 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white font-sans overflow-hidden p-4">
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="text-4xl md:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Saundrya Earth
        </div>
        <div className="relative z-10 w-full p-8 bg-white rounded-3xl shadow-xl border border-gray-100 backdrop-blur-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Set New Password
            </h1>
            <p className="text-gray-500 mb-4">
              Loading...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;

export const dynamic = 'force-dynamic';