import React from "react";

const OrderPageSteps = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      {/* Steps indicator */}
      <div className="flex justify-between items-center mb-6 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10"></div>
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= step.id
                  ? "bg-pink-600 text-white"
                  : "bg-white border-2 border-gray-300 text-gray-400"
              }`}
            >
              {step.icon}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                currentStep >= step.id ? "text-pink-600" : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPageSteps;
