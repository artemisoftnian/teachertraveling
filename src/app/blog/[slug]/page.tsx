import { notFound } from "next/navigation";
import { client } from "@/lib/tina/client";
import { tinaField } from "@/lib/tina/field";

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await client.queries.post({ relativePath: `${slug}.md` }).catch(() => notFound());
  const post = data?.post;
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm opacity-70" data-tina-field={tinaField(post, "date")}>
        {new Date(String(post.date)).toLocaleDateString(undefined, { dateStyle: "long" })}
      </p>
      <h1 className="font-display mt-3 text-4xl" data-tina-field={tinaField(post, "title")}>{post.title}</h1>
      <div className="prose mt-8">{/* Render post.body with the TinaMDX components map */}</div>
    </article>
  );
}
