"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Package,
  Truck,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  Info,
  ArrowRight,
} from "lucide-react";

const OrderTrackingPage = ({ orderData }) => {
  const router = useRouter();

  if (!orderData) return null;

  const {
    orderNumber,
    status,
    lastUpdateDetails,
    courierName,
    trackingNumber,
    lastUpdate,
    origin,
    destination,
    edd,
    history = [],
  } = orderData;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (currentStatus) => {
    const s = currentStatus?.toLowerCase() || "";
    if (s.includes("delivered"))
      return "text-green-600 bg-green-50 border-green-100";
    if (s.includes("transit") || s.includes("up"))
      return "text-blue-600 bg-blue-50 border-blue-100";
    if (
      s.includes("received") ||
      s.includes("processing") ||
      s === "unfulfilled"
    )
      return "text-orange-600 bg-orange-50 border-orange-100";
    return "text-gray-600 bg-gray-50 border-gray-100";
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans selection:bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Navigation */}
        <button
          onClick={() => router.push("/account?tab=orders")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </button>

        <div className="space-y-6">
          {/* Section 1: Order Header */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 mb-1">
                    Order #{orderNumber}
                  </h1>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lastUpdateDetails || status)}`}
                  >
                    {lastUpdateDetails || status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      Courier Partner
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {courierName || "Shiprocket"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      Tracking ID
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {trackingNumber || "Assigning shortly"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 md:pt-0 md:text-right border-t md:border-t-0 border-gray-100">
                <div className="flex items-center md:justify-end gap-2 text-gray-400 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Last Updated
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {formatDate(lastUpdate)}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Shipment Summary */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 pb-4 border-b border-gray-50">
              Shipment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                      Origin
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {origin || "Our Warehouse"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 bg-gray-50 rounded-lg">
                    <Truck className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                      Delivering To
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {destination || "Customer Location"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-1 md:col-start-3 bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Estimated Delivery
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {edd || "Updating shortly"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Pending carrier pick up
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Tracking History */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Tracking Updates
              </h2>
              {history.length > 0 && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  Live Status
                </span>
              )}
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  Preparing your order
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  We have received your order. Our team is preparing your
                  package for shipment. Tracking updates will appear here once
                  the courier picks it up.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 md:pl-8 space-y-10">
                {/* Vertical Line */}
                <div className="absolute left-[11px] md:left-[15px] top-1 bottom-1 w-[2px] bg-gray-100"></div>

                {history
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((item, index) => (
                    <div key={index} className="relative group">
                      {/* Circle */}
                      <div
                        className={`absolute -left-[23px] md:-left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white transition-colors ${
                          index === 0
                            ? "border-blue-600 ring-4 ring-blue-50"
                            : "border-gray-200"
                        }`}
                      ></div>

                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p
                            className={`text-sm font-bold ${index === 0 ? "text-gray-900" : "text-gray-600"}`}
                          >
                            {item.status}
                          </p>
                          <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                            {item.activity}
                          </p>
                          {item.location && (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                              <MapPin className="w-3 h-3" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-left md:text-right shrink-0">
                          <p className="text-[11px] font-bold text-gray-400 capitalize whitespace-nowrap">
                            {item.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>

          {/* Help / Support Section */}
          <section className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Need help with your delivery?
                </h4>
                <p className="text-xs text-gray-500">
                  Contact our support team if you have any questions about your
                  tracking status.
                </p>
              </div>
            </div>
            <button onClick={() => router.push('/support')} className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-blue-600 transition-colors uppercase tracking-widest group">
              Contact Support
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </section>
        </div>

        {/* Footer padding */}
        <div className="h-12"></div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
