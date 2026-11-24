import { notFound } from "next/navigation";
import { client, slugToRelativePath } from "@/lib/tina/client";
import { pageWithSettingsQuery } from "@/lib/tina/queries";
import { TinaLive } from "@/components/TinaLive";

export const dynamic = "force-dynamic";

type PageData = {
  page: Record<string, unknown> | null;
  settings?: {
    name?: string;
    nav?: { label: string; href: string }[];
    social?: { platform: string; url: string }[];
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const relativePath = slugToRelativePath(slug);
  const variables = { relativePath, settingsRelativePath: "settings.json" };
  const result = await client
    .request({ query: pageWithSettingsQuery, variables }, {})
    .catch(() => notFound());
  const data = result.data as PageData | null;
  if (!data?.page) notFound();

  // /admin renders this same route inside the editor with live content.
  return (
    <TinaLive
      query={pageWithSettingsQuery}
      data={data}
      variables={variables}
    />
  );
}
