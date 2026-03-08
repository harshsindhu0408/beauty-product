import React from "react";
import { Shield, Key, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

const SecurityTab = () => {
  const handleFeatureClick = () => {
    toast("Feature Coming Soon! 🚀", {
      icon: "🚧",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      duration: 3000,
    });
  };

  return (
    <div className="w-full animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Security Settings
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Keep your account secure by managing passwords and authentication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <div
          onClick={handleFeatureClick}
          className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-gray-100 p-6 flex flex-col items-start gap-4 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
            <Key size={22} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Change Password
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Update your password regularly to keep your account highly secure.
            </p>
          </div>
        </div>

        <div
          onClick={handleFeatureClick}
          className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-gray-100 p-6 flex flex-col items-start gap-4 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
            <Smartphone size={22} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              Two-Factor Authentication
              <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Recommended
              </span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Add an extra layer of security using an authenticator app or SMS
              code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
