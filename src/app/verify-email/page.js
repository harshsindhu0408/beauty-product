import { FetchData } from "@/services/useServerFetch";
import VerificationResult from "@/components/VerificationResult";

export const dynamic = "force-dynamic";

export default async function VerifyEmail({ searchParams }) {
  try {
    const token = searchParams?.token;

    if (!token) {
      return <VerificationResult status="invalid" />;
    }

    const response = await FetchData(`auth/verify-email/${token}`, {
      method: "POST",
    });

    if (!response) {
      return <VerificationResult status="failed" />;
    }

    return <VerificationResult status="success" />;
  } catch (error) {
    console.error("Verification error:", error);
    return <VerificationResult status="error" />;
  }
}
