import { notFound } from "next/navigation";
import { client, slugToRelativePath } from "@/lib/tina/client";
import { pageQuery, settingsQuery } from "@/lib/tina/queries";
import { TinaLive } from "@/components/TinaLive";
import { Blocks } from "@/components/Blocks";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug = [] } = await params;
  const sp = await searchParams;
  const relativePath = slugToRelativePath(slug);
  const [{ data }, settings] = await Promise.all([
    client.queries.page({ relativePath }).catch(() => notFound()),
    client.queries.settings({ relativePath: "settings.json" }).then((r) => r.data.settings),
  ]);
  if (!data?.page) notFound();

  // /admin renders this same route inside the editor with live content.
  return (
    <TinaLive
      query={pageQuery + settingsQuery}
      data={data as unknown as Record<string, unknown>}
      variables={{ relativePath }}
      live={sp["tina-admin"] === "true"}
    >
      {(d) => <Blocks page={(d as { page: Record<string, unknown> }).page} settings={settings} />}
    </TinaLive>
  );
}
