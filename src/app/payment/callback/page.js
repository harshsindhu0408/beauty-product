// src/app/payment/callback/page.js
import PaymentCallbackClient from "@/components/PaymentCallbackClient";
import { Suspense } from "react"; // 1. Import Suspense

export const dynamic = "force-dynamic";

export default function PaymentCallbackPage() {
  return (
    // 2. Wrap the client component in a Suspense boundary
    <Suspense fallback={<PageFallback />}>
      <PaymentCallbackClient />
    </Suspense>
  );
}

// 3. (Optional but recommended) Create a simple fallback for this page
function PageFallback() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    </div>
  );
}