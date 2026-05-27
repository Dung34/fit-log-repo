"use client";

import {
  Block,
  BlockTitle,
  Button,
  Navbar,
  Page,
} from "konsta/react";
import { useRouter } from "next/navigation";
import { SessionList } from "@/components/dashboard/session-list";
import { todayISO } from "@/lib/utils/date";

export function DashboardPage() {
  const router = useRouter();

  return (
    <Page>
      <Navbar
        title="FitLog"
        right={
          <Button clear small onClick={() => router.push("/exercises")}>
            Bài tập
          </Button>
        }
      />

      <Block strong inset>
        <Button
          large
          onClick={() => router.push(`/workout/${todayISO()}`)}
        >
          Bắt đầu tập hôm nay
        </Button>
      </Block>

      <BlockTitle>Lịch sử tập</BlockTitle>
      <SessionList />
    </Page>
  );
}
