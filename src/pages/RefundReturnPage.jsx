import React from "react";
import {
  ShieldCheckIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const RefundReturnPage = () => {
  return (
    <div className="min-h-screen pt-30 bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-900 to-teal-800 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <ShieldCheckIcon className="h-16 w-16 mx-auto mb-6 text-emerald-200" />
            <h1 className="text-4xl lg:text-5xl font-serif font-light mb-6">
              Refund & Return Policy
            </h1>
            <p className="text-xl text-emerald-100 font-light max-w-2xl mx-auto leading-relaxed">
              Our commitment to conscious commerce extends to transparent and
              ethical financial practices that honor both our customers and our
              values.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Current Policy Statement */}
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 mb-12">
              <div className="flex items-start gap-4">
                <XCircleIcon className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-serif font-light text-gray-900 mb-4">
                    Our Current Return Policy
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    At Saundrya Earth, we are deeply committed to the conscious
                    creation and ethical distribution of our skincare rituals.
                    As part of our sustainable business model and to minimize
                    environmental impact through reduced shipping,{" "}
                    <strong>we do not currently accept product returns</strong>
                    for change of mind or preference.
                  </p>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <ClockIcon className="h-5 w-5" />
                      Important Notice
                    </h3>
                    <p className="text-amber-700">
                      We believe in complete transparency. Please review your
                      order carefully before purchase, as we cannot accommodate
                      returns based on scent preferences, texture expectations,
                      or desired results that vary by individual.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Cancellation Process */}
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 mb-12">
              <div className="flex items-start gap-4">
                <ArrowPathIcon className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div className="w-full">
                  <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">
                    Order Cancellation Process
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5" />
                        When Can Orders Be Cancelled?
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-blue-700">
                            Cancellable Statuses:
                          </h4>
                          <ul className="text-blue-600 space-y-1">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Pending orders
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Processing orders
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              On-hold orders
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-rose-700">
                            Non-Cancellable:
                          </h4>
                          <ul className="text-rose-600 space-y-1">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                              Shipped orders
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                              Delivered orders
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                              Already cancelled
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800">
                          Customer-Initiated Cancellation
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600">
                          <p>• Access your order in the dashboard</p>
                          <p>• Select "Cancel Order" option</p>
                          <p>• Provide cancellation reason</p>
                          <p>• Automatic refund processing via Razorpay</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800">
                          Admin-Initiated Cancellation
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600">
                          <p>• Inventory issues</p>
                          <p>• Payment verification failures</p>
                          <p>• Customer request assistance</p>
                          <p>• System or processing errors</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Process */}
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 mb-12">
              <div className="flex items-start gap-4">
                <BanknotesIcon className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">
                    Refund Process & Payment Handling
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Integrated Payment Processing
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        All transactions at Saundrya Earth are securely
                        processed through
                        <strong> Razorpay</strong>, India's leading payment
                        gateway. This integration ensures that your financial
                        data remains protected while providing seamless refund
                        processing when applicable.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-emerald-50 rounded-lg p-4 text-center">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-emerald-600 font-semibold">
                            1
                          </span>
                        </div>
                        <h4 className="font-semibold text-emerald-800 mb-2 text-sm">
                          Cancellation Request
                        </h4>
                        <p className="text-emerald-700 text-xs">
                          Order cancellation initiated with valid reason
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 font-semibold">2</span>
                        </div>
                        <h4 className="font-semibold text-blue-800 mb-2 text-sm">
                          Razorpay Processing
                        </h4>
                        <p className="text-blue-700 text-xs">
                          Automatic refund to original payment method
                        </p>
                      </div>

                      <div className="bg-teal-50 rounded-lg p-4 text-center">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-teal-600 font-semibold">3</span>
                        </div>
                        <h4 className="font-semibold text-teal-800 mb-2 text-sm">
                          Bank Processing
                        </h4>
                        <p className="text-teal-700 text-xs">
                          Amount reflects in 5-10 business days
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Refund Timeline
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Instant Refunds:</strong> Processed
                          immediately upon cancellation approval
                        </p>
                        <p>
                          <strong>Bank Processing:</strong> 5-10 business days
                          depending on your bank
                        </p>
                        <p>
                          <strong>Refund Status:</strong> Trackable in your
                          order history and Razorpay dashboard
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exceptional Circumstances */}
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 mb-12">
              <div className="flex items-start gap-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-rose-500 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">
                    Exceptional Circumstances & Quality Assurance
                  </h2>

                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      While we maintain a no-return policy for preference-based
                      decisions, we are committed to resolving genuine issues
                      that fall outside our quality standards. In such
                      exceptional cases, refunds may be processed:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-rose-50 rounded-lg p-6 border border-rose-200">
                        <h4 className="font-semibold text-rose-800 mb-3">
                          Damaged Products
                        </h4>
                        <p className="text-rose-700 text-sm">
                          Products arriving damaged due to shipping issues.
                          Requires photographic evidence within 48 hours of
                          delivery.
                        </p>
                      </div>

                      <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-3">
                          Incorrect Shipments
                        </h4>
                        <p className="text-amber-700 text-sm">
                          Wrong items received compared to order. Must be
                          reported within 24 hours of delivery with unboxing
                          video.
                        </p>
                      </div>

                      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-3">
                          Quality Defects
                        </h4>
                        <p className="text-red-700 text-sm">
                          Manufacturing defects affecting product safety or
                          performance. Requires detailed documentation.
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-3">
                          Expired Products
                        </h4>
                        <p className="text-purple-700 text-sm">
                          Products nearing or past expiration date at time of
                          delivery. Batch code verification required.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Documentation Requirements
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Clear photographs/videos of the issue</li>
                        <li>• Order number and product batch code</li>
                        <li>• Description of the problem</li>
                        <li>
                          • Timestamp of discovery (within 48 hours of delivery)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Commitment */}
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-8">
              <h2 className="text-2xl font-serif font-light text-emerald-900 mb-4">
                Our Environmental Commitment
              </h2>
              <p className="text-emerald-800 leading-relaxed mb-6">
                Our no-return policy is rooted in our commitment to
                sustainability. Each return shipment generates additional carbon
                emissions and packaging waste, which contradicts our core
                mission of environmental stewardship.
              </p>

              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-800 mb-2">
                    Carbon Footprint Reduction
                  </h4>
                  <p className="text-emerald-700">
                    By minimizing unnecessary shipping, we reduce our carbon
                    footprint and contribute to a healthier planet.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-800 mb-2">
                    Package Waste Prevention
                  </h4>
                  <p className="text-emerald-700">
                    Reduced shipping means less packaging waste, aligning with
                    our closed-loop sustainability goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center mt-12">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-serif font-light text-gray-900 mb-4">
                  Need Assistance?
                </h3>
                <p className="text-gray-600 mb-6">
                  For cancellation requests or to report exceptional
                  circumstances, please contact our conscious care team.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    Email:{" "}
                    <span className="text-emerald-600">
                      care@saundryaearth.com
                    </span>
                  </p>
                  <p>
                    Response Time:{" "}
                    <span className="text-emerald-600">Within 24 hours</span>
                  </p>
                  <p>
                    Hours:{" "}
                    <span className="text-emerald-600">
                      Mon-Sat, 10AM-6PM IST
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundReturnPage;
