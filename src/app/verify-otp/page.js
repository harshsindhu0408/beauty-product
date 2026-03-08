import React, { Suspense } from "react";
import VerifyOtpPageClient from "@/pages/VerifyOtpPageClient";

const VerifyOtpPage = () => {
  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      <VerifyOtpPageClient />
    </Suspense>
  );
};

function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-stone-400 font-medium">Loading…</p>
      </div>
    </div>
  );
}

export default VerifyOtpPage;

export const dynamic = "force-dynamic";
