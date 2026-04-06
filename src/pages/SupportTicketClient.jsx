"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  User,
  Mail,
  Phone,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Shield,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// --- Helper Functions ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

// --- Status Badge Component ---
const TicketStatusBadge = ({ status }) => {
  const statusConfig = {
    open: {
      style: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
      icon: <Clock size={14} className="inline mr-1" />,
    },
    "in-progress": {
      style:
        "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg",
      icon: <Loader2 size={14} className="inline mr-1 animate-spin" />,
    },
    resolved: {
      style:
        "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
      icon: <CheckCircle size={14} className="inline mr-1" />,
    },
    closed: {
      style: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg",
      icon: <CheckCircle size={14} className="inline mr-1" />,
    },
    pending: {
      style:
        "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg",
      icon: <Clock size={14} className="inline mr-1" />,
    },
    default: {
      style: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg",
      icon: <AlertCircle size={14} className="inline mr-1" />,
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.default;
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`px-4 py-2 text-sm font-bold rounded-full capitalize flex items-center w-fit shadow-md ${config.style}`}
    >
      {config.icon}
      {status}
    </motion.span>
  );
};

// --- Message Bubble Component ---
const MessageBubble = ({ message, isCurrentUser, timestamp, user }) => {
  // If repliedBy is a string (user ID), show default user info
  const userInfo =
    typeof user === "string"
      ? {
          _id: user,
          profile: { name: "User" },
          role: "user",
        }
      : user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-6`}
    >
      <div className="flex max-w-[85%] gap-3">
        {!isCurrentUser && (
          <div className="flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                userInfo?.role === "superAdmin" // FIX: Added ?.
                  ? "bg-gradient-to-r from-red-500 to-pink-500"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500"
              }`}
            >
              {userInfo?.profile?.name?.charAt(0) || "U"} {/* FIX: Added ?. */}
            </div>
          </div>
        )}

        <div className="flex-1">
          {!isCurrentUser && userInfo && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-gray-700">
                {userInfo.role === "superAdmin"
                  ? "Support Team"
                  : userInfo.profile?.name}
              </span>
              {userInfo.role === "superAdmin" && (
                <Shield size={12} className="text-red-500" />
              )}
            </div>
          )}

          <div
            className={`rounded-2xl p-4 shadow-lg ${
              isCurrentUser
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "bg-white border border-gray-200 text-gray-800"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {message?.message} {/* FIX: Added ?. */}
            </p>
          </div>

          <div
            className={`text-xs mt-1 px-1 ${
              isCurrentUser ? "text-right text-gray-500" : "text-gray-400"
            }`}
          >
            {formatTimeAgo(timestamp)}
          </div>
        </div>

        {isCurrentUser && (
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {userInfo?.profile?.name?.charAt(0) || "U"}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Main Client Component ---
const SupportTicketClient = ({ ticketData }) => {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticket, setTicket] = useState(ticketData);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [ticket?.replies]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        message: replyMessage,
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      // Get token from cookies or localStorage
      let accessToken;

      // Try cookies first
      if (typeof document !== "undefined") {
        const match = document.cookie.match(/(^| )accessToken=([^;]+)/);
        if (match) {
          accessToken = match[2];
        } else {
          // Fallback to localStorage
          accessToken = localStorage.getItem("accessToken");
        }
      }

      const res = await fetch(`${baseUrl}support/${ticket?._id}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify(payload),
      });

      const response = await res.json();

      if (response?.success) {
        // Update the ticket with the new reply from response.data
        setTicket((prev) => ({
          ...prev,
          replies: response?.data?.replies, // Use the full replies array from response
          status: response?.data?.status, // Update status if changed
          updatedAt: response?.data?.updatedAt,
        }));

        setReplyMessage("");
        toast.success("Reply sent successfully!");
      } else {
        toast.error(response?.message || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Enhanced Header */}
      <div className="bg-white/80 pt-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer bg-white/80 hover:bg-white px-4 py-2 rounded-xl border border-gray-200/60 shadow-sm"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Back</span>
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Support Ticket
                  </h1>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <FileText size={14} />
                    Ticket ID: #{ticket?._id?.slice(-8).toUpperCase()}{" "}
                    {/* FIX: Added ?. before slice */}
                  </p>
                </div>
              </div>
            </div>

            <TicketStatusBadge status={ticket?.status} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Enhanced Ticket Information Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/60 p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-pink-500" />
                Ticket Information
              </h3>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100">
                  <label className="text-sm font-semibold text-gray-600 block mb-2">
                    Subject
                  </label>
                  <p className="text-gray-800 font-bold text-lg">
                    {ticket?.subject}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {ticket?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {ticket?.email} {/* FIX: Added ?. */}
                      </p>
                    </div>
                  </div>

                  {ticket?.phone && ( // FIX: Added ?.
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Phone size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {ticket?.phone} {/* FIX: Added ?. */}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar size={16} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(ticket?.createdAt)} {/* FIX: Added ?. */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white"
            >
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <MessageCircle size={18} />
                Conversation Stats
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Total Replies</span>
                  <span className="font-bold text-lg">
                    {ticket?.replies?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Last Activity</span>
                  <span className="font-bold text-sm">
                    {formatTimeAgo(ticket?.updatedAt)} {/* FIX: Added ?. */}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Chat Area */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden flex flex-col h-[calc(100vh-12rem)]"
            >
              {/* Original Message Header */}
              <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-blue-50/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-lg">
                    {ticket?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-800 text-lg">
                        {ticket?.name}
                      </h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        Ticket Creator
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Created {formatTimeAgo(ticket?.createdAt)}{" "}
                      {/* FIX: Added ?. */}
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {ticket?.message} {/* FIX: Added ?. */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Thread - FIXED SCROLLING */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50/50 to-blue-50/30"
              >
                <AnimatePresence>
                  {ticket?.replies && ticket?.replies.length > 0 ? (
                    <div className="space-y-1">
                      {ticket?.replies?.map((reply, index) => ( // FIX: Added ?.
                        <MessageBubble
                          key={reply?._id}
                          message={reply}
                          isCurrentUser={reply?.repliedBy?._id === ticket?.user}
                          timestamp={reply?.createdAt}
                          user={reply?.repliedBy}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="bg-white/80 rounded-2xl p-8 border border-gray-200/60 shadow-sm max-w-md mx-auto">
                        <MessageCircle
                          size={56}
                          className="mx-auto mb-4 text-gray-300"
                        />
                        <h4 className="text-xl font-bold text-gray-600 mb-2">
                          No Replies Yet
                        </h4>
                        <p className="text-gray-500">
                          Be the first to respond to this support ticket.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Form */}
              {ticket?.status !== "closed" && ( // FIX: Added ?.
                <div className="p-6 border-t border-gray-200/60 bg-white">
                  <form onSubmit={handleSubmitReply} className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply here... (Press Enter to send, Shift+Enter for new line)"
                        className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-3 focus:ring-pink-500/30 focus:border-pink-500 resize-none transition-all duration-200 bg-white shadow-sm"
                        rows="3"
                        disabled={isSubmitting}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitReply(e);
                          }
                        }}
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                        {replyMessage.length}/5000
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || !replyMessage.trim()}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-3 focus:ring-pink-500/30 shadow-lg transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Send Reply
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              )}

              {ticket?.status === "closed" && ( // FIX: Added ?.
                <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 text-center border-t border-gray-200/60">
                  <CheckCircle
                    size={48}
                    className="mx-auto mb-4 text-gray-400"
                  />
                  <h4 className="text-xl font-bold text-gray-600 mb-2">
                    Ticket Closed
                  </h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    This support ticket has been closed. No further replies can
                    be sent. If you need additional assistance, please create a
                    new ticket.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketClient;