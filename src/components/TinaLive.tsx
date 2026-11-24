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
  live?: boolean;
};

export function TinaLive({ live, ...props }: Props) {
  if (!live) return <PageView data={props.data} />;
  return <Live {...props} />;
}

function PageView({ data }: { data: PageData }) {
  return (
    <Blocks
      page={(data.page ?? {}) as BlocksProps["page"]}
      settings={data.settings}
    />
  );
}

function Live(props: Omit<Props, "live">) {
  const liveData = useTina(props).data as PageData;
  return (
    <Blocks
      page={(liveData.page ?? {}) as BlocksProps["page"]}
      settings={liveData.settings}
    />
  );
}
