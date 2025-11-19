// app/order/[id]/page.js
import userAuthCheckOnServer from "@/middleware/authMiddleware";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import { FetchData } from "@/services/useServerFetch";

export default async function OrderDetails({ params }) {
  try {
    await userAuthCheckOnServer();
    const [order] = await Promise.all([FetchData(`order/${params.id}`)]);

    if (!order?.data) {
      throw new Error("Order not found");
    }

    return (
      <div className="min-h-screen bg-gray-50 pt-26">
        <OrderDetailsPage orderData={order.data} />
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
            Unable to load the order. Please try again later.
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

export async function generateMetadata({ params }) {
  try {
    const order = await FetchData(`order/${params.id}`);

    if (!order?.data) {
      return {
        title: "Order Not Found",
      };
    }

    return {
      title: `Order #${order.data.order?.orderNumber || params.id}`,
      description: "Order details",
    };
  } catch (error) {
    return {
      title: "Order",
    };
  }
}