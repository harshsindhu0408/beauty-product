"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Phone,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";
import { clientFetch } from "@/services/clientfetch";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    subject: "General Support Inquiry", // Add subject field
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        subject: formData.subject,
        message: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
      };

      const response = await clientFetch(`support`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          message: "",
          subject: "General Support Inquiry",
        });

        // Reset after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error(response.message || "Failed to submit support request");
      }
    } catch (error) {
      console.error("Support request error:", error);
      setIsSubmitting(false);
      // You might want to add error state handling here
    }
  };

  const supportTabs = [
    {
      id: "general",
      label: "General Support",
      icon: <MessageSquare className="w-5 h-5" />,
    },
  ];

  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8 text-indigo-500" />,
      title: "Email Us",
      description: "Typically replies within 2 hours",
      action: "support@saundrya.com",
      link: "mailto:support@saundrya.com",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-pink-500" />,
      title: "Live Chat",
      description: "Available 24/7 for instant help",
      action: "Start Chat",
      link: "/support",
    },
    {
      icon: <Phone className="w-8 h-8 text-emerald-500" />,
      title: "Call Support",
      description: "Mon-Fri, 9AM-6PM EST",
      action: "+1 (555) 123-4567",
      link: "tel:+917403500777",
    },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 border-b border-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Support Center
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Our team is here to help with your orders and products. Typically we
            respond within 2 hours.
          </p>
        </div>
      </section>

      {/* Support Content */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-16 shadow-sm">
            <div className="flex flex-col md:flex-row border-b border-gray-100">
              {supportTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 flex items-center justify-center gap-3 transition-colors ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-bold uppercase tracking-widest">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-8 md:p-12">
              {activeTab === "general" && (
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-6">
                        General Inquiry
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Have questions about our products, services, or
                        policies? Our support team is here to help with any
                        inquiries.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            FAQ Section
                          </p>
                          <p className="text-xs text-gray-500">
                            Quick answers to common questions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            Email Support
                          </p>
                          <p className="text-xs text-gray-500">
                            Fast response within 2 hours
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100">
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Check className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">
                          Message Sent
                        </h4>
                        <p className="text-sm text-gray-500 mb-8">
                          We will get back to you shortly.
                        </p>
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="px-8 py-3 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                          Send Another
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-indigo-600 border-indigo-50 outline-none transition-all shadow-sm"
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            required
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-indigo-600 border-indigo-50 outline-none transition-all shadow-sm"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Subject
                          </label>
                          <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subject: e.target.value,
                              })
                            }
                            required
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-indigo-600 border-indigo-50 outline-none transition-all shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Message
                          </label>
                          <textarea
                            rows="4"
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                message: e.target.value,
                              })
                            }
                            required
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-indigo-600 border-indigo-50 outline-none transition-all shadow-sm resize-none"
                            placeholder="How can we help?"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400 shadow-lg shadow-indigo-100"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Send Message"
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 p-8 h-full flex flex-col hover:border-gray-200 transition-colors"
              >
                <div className="bg-gray-50 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6 flex-1 italic">
                  {method.description}
                </p>
                <a
                  href={method.link}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 group"
                >
                  {method.action}
                  <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-indigo-600 rounded-[2rem] p-12 text-center relative overflow-hidden shadow-2xl shadow-indigo-100">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-6">
                Still Need Help?
              </h3>
              <p className="text-indigo-100 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
                Our support team is available to ensure you have the best
                experience. Reach out via any channel above or use our priority
                lines.
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="/track/test-order" // Improved flow
                  className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2 text-sm uppercase tracking-widest shadow-sm"
                >
                  View My Orders
                </a>
                <a
                  href="tel:+917403500777"
                  className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 text-sm uppercase tracking-widest"
                >
                  Quick Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
