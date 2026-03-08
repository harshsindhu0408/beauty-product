"use client";

import { ReactLenis as ReactLenisClient } from "@studio-freight/react-lenis";

export default function ClientOnlyLenis({ children, ...props }) {
  return (
    <ReactLenisClient
      root
      options={{ lerp: 0.08, smoothWheel: true }}
      {...props}
    >
      {children}
    </ReactLenisClient>
  );
}
