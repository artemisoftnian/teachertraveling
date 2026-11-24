"use client";
// One component per Solo section type. Unknown types fall through to the generic
// renderer, so a new Tina template never crashes the site.
import Image from "next/image";
import Link from "next/link";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown, type TinaMarkdownContent } from "tinacms/dist/rich-text";

type RichTextValue = string | TinaMarkdownContent | null;
type Item = { title?: string | null; text?: RichTextValue; meta?: RichTextValue; url?: string | null; image?: string | null };
export type Section = {
  __typename?: string;
  type?: string;
  headline?: string | null;
  eyebrow?: string | null;
  body?: RichTextValue;
  image?: string | null;
  imageAlt?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  items?: Item[] | null;
};

const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

function Picture({ src, alt = "", className }: { src?: string | null; alt?: string; className?: string }) {
  if (!src) return null;
  if (src.startsWith("/")) return <Image src={src} alt={alt} width={1600} height={1000} className={className} unoptimized />;
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}

function Md({ text }: { text?: string | null }) {
  if (!text) return null;
  const html = String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br />")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a class="underline" href="$2">$1</a>');
  return <div className="prose" dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} />;
}

function RichText({ text }: { text?: RichTextValue }) {
  if (!text) return null;
  if (typeof text === "string") return <Md text={text} />;
  return <div className="prose"><TinaMarkdown content={text} /></div>;
}

function plainText(value?: RichTextValue): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  const nodeText = (node: TinaMarkdownContent): string =>
    ("text" in node ? String((node as { text?: string }).text ?? "") : "") +
    (node.children ?? []).map(nodeText).join("");
  return nodeText(value);
}

export function Blocks({ page, settings }: { page: { title?: string; sections?: Section[] }; settings?: { name?: string; nav?: { label: string; href: string }[]; social?: { platform: string; url: string }[] } }) {
  const sections = page.sections ?? [];
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <Link href="/" className="font-display text-lg font-semibold">{settings?.name}</Link>
        <nav className="flex flex-wrap gap-5 text-sm">
          {(settings?.nav ?? []).map((n) => (
            <Link key={n.href} href={n.href} className="hover:opacity-60">{n.label}</Link>
          ))}
        </nav>
      </header>
      <main>{sections.map((s, i) => <Section key={i} s={s} parent={page} index={i} />)}</main>
      <footer className="mx-auto max-w-5xl border-t px-6 py-10 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} {settings?.name}</span>
          <span className="flex gap-4">
            {(settings?.social ?? []).map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="hover:opacity-60">{s.platform}</a>
            ))}
          </span>
        </div>
      </footer>
    </div>
  );
}

function Section({ s, parent, index }: { s: Section; parent: unknown; index: number }) {
  const wrap = "mx-auto max-w-5xl px-6 py-14";
  const field = (name: string) => ({ "data-tina-field": tinaField(parent as never, `sections.${index}.${name}`) });
  const kind = s.type ?? s.__typename?.replace(/^PageSections/, "").toLowerCase() ?? "";
  switch (kind) {
    case "hero":
      return (
        <section className={`${wrap} grid items-center gap-10 md:grid-cols-2`}>
          <div>
            {s.eyebrow ? <p className="mb-3 text-sm uppercase tracking-wide text-accent" {...field("eyebrow")}>{s.eyebrow}</p> : null}
            <h1 className="font-display text-4xl leading-[1.1] md:text-5xl" {...field("headline")}>{s.headline}</h1>
            <div className="mt-5 max-w-prose opacity-90" {...field("body")}><RichText text={s.body} /></div>
            {s.ctaLabel ? <Link href={s.ctaUrl ?? "#contact"} className="mt-6 inline-block rounded-full bg-accent px-5 py-3 text-sm font-medium" style={{ color: "var(--accent-ink, #fff)" }}>{s.ctaLabel}</Link> : null}
          </div>
          <Picture src={s.image} alt={s.imageAlt ?? ""} className="w-full rounded-2xl" />
        </section>
      );
    case "contact":
      return (
        <section id="contact" className={wrap}>
          <h2 className="font-display text-3xl" {...field("headline")}>{s.headline ?? "Get in touch"}</h2>
          <div className="mt-4 max-w-prose opacity-90" {...field("body")}><RichText text={s.body} /></div>
          <ContactForm fields={(s.items ?? []) as Item[]} submit={s.ctaLabel ?? "Send"} />
        </section>
      );
    case "cta":
      return (
        <section className={`${wrap}`}>
          <div className="rounded-2xl bg-ink/5 p-10 text-center">
            <h2 className="font-display text-3xl" {...field("headline")}>{s.headline}</h2>
            <div className="mx-auto mt-3 max-w-prose opacity-90" {...field("body")}><RichText text={s.body} /></div>
            {s.ctaLabel ? <Link href={s.ctaUrl ?? "#contact"} className="mt-6 inline-block rounded-full bg-accent px-5 py-3 text-sm font-medium">{s.ctaLabel}</Link> : null}
          </div>
        </section>
      );
    case "gallery":
      return (
        <section className={wrap}>
          {s.headline ? <h2 className="font-display text-3xl" {...field("headline")}>{s.headline}</h2> : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(s.items ?? []).map((it, i) => (
              <figure key={i} className="overflow-hidden rounded-xl bg-ink/5">
                <Picture src={it.image} alt={plainText(it.meta) ?? it.title ?? ""} className="w-full" />
                {it.title ? <figcaption className="px-4 py-3 text-sm">{it.title}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      );
    case "testimonials":
    case "quote":
      return (
        <section className={wrap}>
          {s.headline ? <h2 className="font-display text-3xl" {...field("headline")}>{s.headline}</h2> : null}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {(s.items ?? []).map((it, i) => (
              <blockquote key={i} className="border-l-2 border-accent pl-4">
                <div className="font-display text-lg leading-relaxed">“<RichText text={it.text ?? it.title} />”</div>
                {it.meta ? <cite className="mt-2 block text-sm not-italic opacity-70">{plainText(it.meta)}</cite> : null}
              </blockquote>
            ))}
          </div>
        </section>
      );
    case "faq":
      return (
        <section className={wrap}>
          {s.headline ? <h2 className="font-display text-3xl" {...field("headline")}>{s.headline}</h2> : null}
          <div className="mt-6 divide-y">
            {(s.items ?? []).map((it, i) => (
              <details key={i} className="py-4">
                <summary className="cursor-pointer font-medium">{it.title}</summary>
                <div className="mt-2 opacity-90"><RichText text={it.text} /></div>
              </details>
            ))}
          </div>
        </section>
      );
    case "stats":
      return (
        <section className={wrap}>
          <div className="grid gap-6 text-center sm:grid-cols-3">
            {(s.items ?? []).map((it, i) => (
              <div key={i}>
                <div className="font-display text-3xl text-accent">{it.title}</div>
                <div className="mt-1 text-sm opacity-80"><RichText text={it.text} /></div>
              </div>
            ))}
          </div>
        </section>
      );
    default:
      return (
        <section className={wrap}>
          {s.headline ? <h2 className="font-display text-3xl" {...field("headline")}>{s.headline}</h2> : null}
          {kind === "image" && s.image ? <Picture src={s.image} alt={s.imageAlt ?? ""} className="mt-6 w-full rounded-2xl" /> : null}
          {s.body && kind !== "heading" ? <div className="mt-4 max-w-prose" {...field("body")}><RichText text={s.body} /></div> : null}
          {s.items?.length ? (
            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {s.items.map((it, i) => (
                <li key={i} className="rounded-xl border p-5">
                  {it.image ? <Picture src={it.image} alt={plainText(it.meta) ?? ""} className="mb-3 w-full rounded-lg" /> : null}
                  {it.title ? <h3 className="font-medium">{it.title}</h3> : null}
                  {it.text ? <div className="mt-1 text-sm opacity-85"><RichText text={it.text} /></div> : null}
                  {it.url ? <a href={it.url} className="mt-3 inline-block text-sm text-accent underline">{plainText(it.meta) ?? "More"}</a> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {s.ctaLabel ? <Link href={s.ctaUrl ?? "#contact"} className="mt-6 inline-block text-sm text-accent underline">{s.ctaLabel}</Link> : null}
        </section>
      );
  }
}

function ContactForm({ fields, submit }: { fields: Item[]; submit: string }) {
  const list = (fields.length ? fields : [{ title: "name" }, { title: "email" }, { title: "message" }]) as { title?: string | null }[];
  return (
    <form action={FORM_ENDPOINT ?? "#"} method={FORM_ENDPOINT ? "post" : undefined} className="mt-6 grid max-w-xl gap-4">
      {list.map((f, i) => {
        const name = String(f.title ?? "message").replace(/[^a-z0-9]/gi, "_").toLowerCase();
        const long = /message|question|details|note|bio/i.test(name);
        const required = /mail|name|organisations?$|date/i.test(name);
        return (
          <label key={i} className="grid gap-1 text-sm">
            <span className="uppercase tracking-wide opacity-70">{name.replace(/_/g, " ")}</span>
            {long
              ? <textarea name={name} rows={5} required={required} className="rounded-lg border bg-transparent p-3 text-base" />
              : <input name={name} type={/mail|date|tel/.test(name) ? name.replace(/(mail|date|tel).*/, (m) => (m === "mail" ? "email" : m)) : "text"} required={required} className="rounded-lg border bg-transparent p-3 text-base" />}
          </label>
        );
      })}
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
      <button type="submit" className="w-fit rounded-full bg-accent px-5 py-3 text-sm font-medium">{submit}</button>
      {!FORM_ENDPOINT ? <p className="text-xs opacity-70">Not wired yet: set NEXT_PUBLIC_FORM_ENDPOINT (or swap the action for /api/lead).</p> : null}
    </form>
  );
}
