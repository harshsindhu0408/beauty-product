import userAuthCheckOnServer from "@/middleware/authMiddleware";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import { FetchData } from "@/services/useServerFetch";

export default async function OrderTrackingDetails({ params }) {
  try {
    await userAuthCheckOnServer();
    const [order] = await Promise.all([FetchData(`order/${params.id}/track`)]);

    if (!order?.data) {
      throw new Error("Order not found");
    }

    return (
      <div className="min-h-screen bg-gray-50 pt-10">
        <OrderTrackingPage
          orderData={order?.data}
          orderId={params.id}
          trackingData={order?.data?.[params.id]?.tracking_data}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching order:", error);

    return (
      <div className="min-h-screen bg-gray-50 pt-26 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load the tracking data. Please try again later.
          </p>
          <a
            href="/orders"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Orders
          </a>
        </div>
      </div>
    );
  }
}
