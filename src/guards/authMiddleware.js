import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function userAuthCheckOnServer() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const headerList = await headers();
  const fullPath = headerList.get("x-pathname") || "/";

  if (accessToken) {
    return true;
  } else {
    redirect(`/auth?redirectTo=${encodeURIComponent(fullPath)}`);
  }
}
