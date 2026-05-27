"use client";

import { Block, Navbar, Page } from "konsta/react";

export default function OfflinePage() {
  return (
    <Page>
      <Navbar title="FitLog" />
      <Block strong inset>
        <p className="text-center text-black/60 dark:text-white/60">
          Bạn đang offline. Mở lại app khi đã có kết nối mạng.
        </p>
      </Block>
    </Page>
  );
}
