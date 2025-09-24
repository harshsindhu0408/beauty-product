import userAuthCheckOnServer from "@/middleware/authMiddleware";
import CheckoutPage from "@/pages/CheckoutPage";
import { FetchData } from "@/services/useServerFetch";
import CheckoutError from "@/components/CheckoutError";

export default async function CheckoutProducts({ searchParams }) {
  try {
    await userAuthCheckOnServer();

    const params = await searchParams;
    const { sessionId } = params;

    if (!sessionId) {
      throw new Error("Missing session ID");
    }

    // Fetch checkout session data from API
    const [sessionResult, addressesResult] = await Promise.allSettled([
      FetchData(`checkout/verify?sessionId=${sessionId}`, {
        method: "GET",
      }),
      FetchData("address?isActive=true"),
    ]);

    // Handle session response
    let session = null;
    if (sessionResult.status === "fulfilled") {
      session = sessionResult.value;
    } else {
      console.error("Session fetch failed:", sessionResult.reason);
      throw new Error("Failed to fetch checkout session");
    }

    // Handle addresses response
    let userAddresses = [];
    if (addressesResult.status === "fulfilled") {
      userAddresses = addressesResult.value.data || [];
    } else {
      console.warn("Addresses fetch failed, using empty array:", addressesResult.reason);
    }

    // Check if the session contains an error (based on your backend structure)
    if (session?.error) {
      throw new Error(session.message || "Invalid checkout session");
    }

    // Check if the session indicates success and has valid data
    if (!session || !session.success || !session.data) {
      throw new Error("Invalid or expired checkout session");
    }

    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <CheckoutPage
          addresses={userAddresses}
          sessionData={session.data}
          sessionId={sessionId}
        />
      </div>
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return <CheckoutError />;
  }
}