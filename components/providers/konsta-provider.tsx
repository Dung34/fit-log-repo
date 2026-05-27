"use client";

import { App } from "konsta/react";

function KonstaProvider({ children }: { children: React.ReactNode }) {
  return (
    <App theme="ios" safeAreas dark={true}>
      {children}
    </App>
  );
}

export default KonstaProvider;
