import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function userAuthCheckOnServer() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (accessToken) {
    return true;
  } else {
    redirect("/auth");
  }
}
