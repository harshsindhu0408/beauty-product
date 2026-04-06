import React, { Suspense } from "react";
// app/order/[id]/page.js
import userAuthCheckOnServer from "@/guards/authMiddleware";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import { FetchData } from "@/services/useServerFetch";

export default async function OrderDetails({ params }) {
  const { id } = await params;
  try {
    await userAuthCheckOnServer();
    const [order] = await Promise.all([FetchData(`order/${id}`)]);

    if (!order?.data) {
      throw new Error("Order not found");
    }

    return (
      <div className="min-h-screen bg-gray-50 pt-10">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 font-medium">Loading order details...</p>
            </div>
          </div>
        }>
          <OrderDetailsPage orderData={order.data} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error fetching order:", error);

    return (
      <div className="min-h-screen bg-gray-50 pt-10 flex items-center justify-center">
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
  const { id } = await params;
  try {
    const order = await FetchData(`order/${id}`);

    if (!order?.data) {
      return {
        title: "Order Not Found",
      };
    }

    return {
      title: `Order #${order.data.order?.orderNumber || id}`,
      description: "Order details",
    };
  } catch (error) {
    return {
      title: "Order",
    };
  }
}
