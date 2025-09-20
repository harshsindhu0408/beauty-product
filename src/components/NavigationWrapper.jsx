"use client";
import { usePathname } from "next/navigation";
import NavigationMain from "./NavigationMain";

export default function NavigationWrapper() {
  const pathname = usePathname();
  
  // Don't render on homepage
  if (pathname === "/") {
    return null;
  }
  
  return <NavigationMain />;
}