import { redirect } from "next/navigation";
import AccountPageClient from "@/pages/AccountPageClient";
import { FetchData } from "@/services/useServerFetch";
import userAuthCheckOnServer from "@/middleware/authMiddleware";

export default async function AccountPage() {
  await userAuthCheckOnServer();

  // Fetch data in parallel to improve performance
  const [userData, orders, addresses, supportTickets] =
    await Promise.allSettled([
      FetchData("profile"),
      FetchData("order/my-orders?page=1&limit=9"),
      FetchData("address?isActive=true"),
      FetchData("support"),
    ]);

  // Extract data from Promise results
  const user = userData.status === "fulfilled" ? userData.value : null;
  const userOrders = orders.status === "fulfilled" ? orders.value : [];
  const userAddresses = addresses.status === "fulfilled" ? addresses.value : [];
  const support =
    supportTickets.status === "fulfilled" ? supportTickets.value : [];

  // If any critical data fetch failed, you might want to handle it
  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      <AccountPageClient
        userData={user.data}
        orders={userOrders.data}
        addresses={userAddresses.data}
        support={support}
      />
    </div>
  );
}
