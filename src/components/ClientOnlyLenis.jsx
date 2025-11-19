"use client";

import dynamic from "next/dynamic";

const ReactLenisClient = dynamic(
  () => import("@studio-freight/react-lenis").then((mod) => mod.ReactLenis),
  {
    ssr: false,
    loading: ({ children }) => <>{children}</>,
  }
);

export default function ClientOnlyLenis({ children, ...props }) {
  return (
    <ReactLenisClient root options={{ lerp: 0.08, smoothWheel: true }} {...props}>
      {children}
    </ReactLenisClient>
  );
}