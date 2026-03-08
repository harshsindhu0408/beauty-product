import userAuthCheckOnServer from "@/middleware/authMiddleware";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import { FetchData } from "@/services/useServerFetch";
import { Info } from "lucide-react";

export default async function OrderTrackingDetails({ params }) {
  const { id } = await params;
  try {
    await userAuthCheckOnServer();
    const [order] = await Promise.all([FetchData(`order/${id}/track`)]);

    if (!order?.data) {
      throw new Error("Order not found");
    }

    return <OrderTrackingPage orderData={order?.data} />;
  } catch (error) {
    console.error("Error fetching order:", error);

    return (
      <div className="min-h-screen bg-[#FDFCFD] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Info className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
            Order Not Found
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We couldn&apos;t retrieve the tracking information for this order.
            It might still be processing or the link is incorrect.
          </p>
          <a
            href="/account?tab=orders"
            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 transition-colors inline-block"
          >
            Return to My Orders
          </a>
        </div>
      </div>
    );
  }
}
