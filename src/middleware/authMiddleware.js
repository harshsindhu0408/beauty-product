import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function userAuthCheckOnServer() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (accessToken) {
    return true;
  } else {
    redirect("/auth");
  }
}
