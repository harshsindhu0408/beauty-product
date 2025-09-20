import { redirect } from "next/navigation";
import CartPage from "@/pages/CartPage";
import { FetchData } from "@/services/useServerFetch";
import userAuthCheckOnServer from "@/middleware/authMiddleware";

export default async function Cart() {
  userAuthCheckOnServer();

  const [cart] = await Promise.allSettled([FetchData("cart")]);
  const cartData = cart.status === "fulfilled" ? cart.value : null;

  if (!cartData) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {cartData && <CartPage initialCartData={cartData.data} />}
    </div>
  );
}
