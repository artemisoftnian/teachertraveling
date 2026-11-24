"use client";

import { useTina } from "tinacms/dist/react";
import type { ComponentProps } from "react";
import { Blocks } from "./Blocks";

type BlocksProps = ComponentProps<typeof Blocks>;
type PageData = {
  page: Record<string, unknown> | null;
  settings?: BlocksProps["settings"];
};

type Props = {
  query: string;
  data: PageData;
  variables: Record<string, unknown>;
};

export function TinaLive(props: Props) {
  // useTina must run on every render, including production. In production it
  // passes data through. Inside /admin it enables click-to-edit and live data.
  const liveData = useTina(props).data as PageData;
  return (
    <Blocks
      page={(liveData.page ?? {}) as BlocksProps["page"]}
      settings={liveData.settings}
    />
  );
}
