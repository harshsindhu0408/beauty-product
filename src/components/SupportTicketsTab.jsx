import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Calendar, ChevronRight, Plus, FileText, Clock, CheckCircle, AlertCircle, User, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Helper Functions ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return "Just now";
  }
};

// --- Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// --- Status Badge Component ---
const TicketStatusBadge = ({ status }) => {
  const statusConfig = {
    open: { 
      style: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <Clock size={12} className="inline mr-1" />
    },
    "in-progress": { 
      style: "bg-purple-100 text-purple-800 border-purple-200",
      icon: <Clock size={12} className="inline mr-1" />
    },
    resolved: { 
      style: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle size={12} className="inline mr-1" />
    },
    closed: { 
      style: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <CheckCircle size={12} className="inline mr-1" />
    },
    pending: { 
      style: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <Clock size={12} className="inline mr-1" />
    },
    default: { 
      style: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <AlertCircle size={12} className="inline mr-1" />
    },
  };
  
  const config = statusConfig[status?.toLowerCase()] || statusConfig.default;
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize flex items-center w-fit ${config.style}`}
    >
      {config.icon}
      {status}
    </span>
  );
};

// --- Support Ticket Card Component ---
const SupportTicketCard = ({ ticket }) => {
  const router = useRouter();
  
  // Get the last reply if exists
  const lastReply = ticket.replies && ticket.replies.length > 0 
    ? ticket.replies[ticket.replies.length - 1] 
    : null;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.07)" }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden"
    >
      <header className="bg-gradient-to-r from-gray-50/50 to-white/50 p-4 border-b border-gray-200/80">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                {ticket.subject}
              </h3>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {ticket.message}
            </p>
            
            {/* User Info */}
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{ticket.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={12} />
                <span>{ticket.email}</span>
              </div>
              {ticket.phone && (
                <div className="flex items-center gap-1">
                  <Phone size={12} />
                  <span>{ticket.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FileText size={16} className="text-gray-400" />
            <span>Ticket ID: <strong className="font-mono text-pink-600">#{ticket._id.slice(-8)}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            <span>Created: {formatTimeAgo(ticket.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle size={16} className="text-gray-400" />
            <span>Replies: {ticket.replies?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            <span>Updated: {formatTimeAgo(ticket.updatedAt)}</span>
          </div>
        </div>
        
        {lastReply && (
          <div className="mt-3 p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-600">Last reply: {formatTimeAgo(lastReply.createdAt)}</span>
              <span className="text-gray-500">
                by {lastReply.repliedBy === ticket.user ? 'You' : 'Support Team'}
              </span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {lastReply.message}
            </p>
          </div>
        )}

        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Attachments: {ticket.attachments.length}</p>
          </div>
        )}
      </div>

      <footer className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-xs text-gray-500">
          Last updated: {formatDate(ticket.updatedAt)}
        </div>
        <motion.button
          onClick={() => {
            router.push(`/support/ticket/${ticket._id}`);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-md px-3 py-2 hover:bg-pink-50"
        >
          View Details <ChevronRight size={16} />
        </motion.button>
      </footer>
    </motion.div>
  );
};

// --- Statistics Card Component ---
const StatisticsCard = ({ statistics }) => {
  if (!statistics) return null;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-6"
    >
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Ticket Overview</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {statistics.total || Object.values(statistics.statusCounts || {}).reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-xs text-gray-600">Total Tickets</div>
        </div>
        {Object.entries(statistics.statusCounts || {}).map(([status, count]) => (
          <div key={status} className="text-center">
            <div className="text-2xl font-bold text-gray-800">{count}</div>
            <div className="text-xs text-gray-600 capitalize">{status}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Empty State Component ---
const EmptyTicketsState = () => {
  const router = useRouter();

  return (
    <motion.div
      variants={itemVariants}
      className="text-center py-16 px-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/80"
    >
      <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
      <h4 className="text-2xl font-bold text-gray-700 mb-3">
        No Support Tickets Yet
      </h4>
      <p className="text-gray-500 max-w-md mx-auto mb-2">
        You haven't created any support tickets yet. If you need help with your orders, 
        products, or have any questions, we're here to assist you!
      </p>
      <p className="text-sm text-gray-400 mb-6">
        Common issues: Order tracking, Product inquiries, Returns & refunds, Payment issues
      </p>
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          router.push("/support");
        }}
        className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 rounded-lg shadow-sm cursor-pointer focus:outline-none"
      >
        <Plus size={18} /> Create New Ticket
      </motion.button>
    </motion.div>
  );
};

// --- MAIN SUPPORT TICKETS TAB COMPONENT ---
const SupportTicketsTab = ({ supportTicketsData }) => {
  // Updated to match your API response structure
  const tickets = supportTicketsData?.data?.supportRequests || [];
  console.log("supportTicketsData?.data?.supportTickets", supportTicketsData?.data?.supportRequests)
  const hasTickets = tickets.length > 0;
  const statistics = supportTicketsData?.statistics;
  const pagination = supportTicketsData?.pagination;
  const router = useRouter();

  // Group tickets by status for better organization
  const groupedTickets = hasTickets ? {
    active: tickets.filter(t => ['open', 'in-progress', 'pending'].includes(t.status?.toLowerCase())),
    resolved: tickets.filter(t => ['resolved', 'closed'].includes(t.status?.toLowerCase()))
  } : { active: [], resolved: [] };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header with Create Ticket Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.h3
          variants={itemVariants}
          className="text-2xl font-bold text-gray-800"
        >
          Support Tickets
        </motion.h3>
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            router.push("/support");
          }}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 rounded-lg shadow-sm cursor-pointer focus:outline-none w-fit"
        >
          <Plus size={16} /> New Ticket
        </motion.button>
      </div>

      {/* Statistics Card */}
      {statistics && <StatisticsCard statistics={statistics} />}

      {hasTickets ? (
        <>
          {/* Active Tickets Section */}
          {groupedTickets.active.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <MessageCircle size={20} className="text-blue-500" />
                Active Tickets ({groupedTickets.active.length})
              </h4>
              <div className="space-y-4">
                {groupedTickets.active.map((ticket) => (
                  <SupportTicketCard key={ticket._id} ticket={ticket} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Resolved Tickets Section */}
          {groupedTickets.resolved.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                Resolved Tickets ({groupedTickets.resolved.length})
              </h4>
              <div className="space-y-4 opacity-80">
                {groupedTickets.resolved.map((ticket) => (
                  <SupportTicketCard key={ticket._id} ticket={ticket} />
                ))}
              </div>
            </motion.section>
          )}

          {/* View All Tickets Button */}
          {pagination && pagination.totalItems > 5 && (
            <motion.div variants={itemVariants} className="mt-8 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  router.push("/support");
                }}
                className="px-6 py-3 cursor-pointer text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                View All Support Tickets ({pagination.totalItems})
              </motion.button>
            </motion.div>
          )}
        </>
      ) : (
        <EmptyTicketsState />
      )}
    </motion.div>
  );
};

export default SupportTicketsTab;