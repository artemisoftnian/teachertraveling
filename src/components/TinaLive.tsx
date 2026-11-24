"use client";

import { useTina } from "tinacms";
import type { ReactNode } from "react";

type Props = {
  query: string;
  data: Record<string, unknown>;
  variables: Record<string, unknown>;
  live?: boolean;
  children: (data: Record<string, unknown>) => ReactNode;
};

export function TinaLive({ query, data, variables, live, children }: Props) {
  if (!live) return <>{children(data)}</>;
  return <Live query={query} data={data} variables={variables}>{children}</Live>;
}

function Live({ query, data, variables, children }: Omit<Props, "live">) {
  const live = useTina({ query, data, variables });
  return <>{children(live.data)}</>;
}
