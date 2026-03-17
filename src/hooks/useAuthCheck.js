import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useAuthCheck = () => {
  const router = useRouter();

  const checkAuth = () => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (!accessToken) {
      const currentPath = window.location.pathname + window.location.search;
      toast.error("Please login to continue", {
        id: "auth-check-toast",
      });
      router.push(`/auth?redirectTo=${encodeURIComponent(currentPath)}`);
      return false;
    }
    return true;
  };

  return { checkAuth };
};
