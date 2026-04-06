import React from "react";
import { FetchData } from "@/services/useServerFetch";
import SupportTicketClient from "@/pages/SupportTicketClient";

// Server component that fetches the ticket data
const SupportTicketPage = async ({ params }) => {
  const { id } = params;

  try {
    const ticketResponse = await FetchData(`support/${id}`);

    const ticketData = ticketResponse;

    if (!ticketData || !ticketData.success) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Ticket Not Found
            </h1>
            <p className="text-gray-600">
              The requested support ticket could not be found.
            </p>
          </div>
        </div>
      );
    }

    return <SupportTicketClient ticketData={ticketData?.data} />;
  } catch (error) {
    console.error("Error fetching support ticket:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600">
            Failed to load the support ticket. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default SupportTicketPage;
