"use client";
// One component per Solo section type. Unknown types fall through to the generic
// renderer, so a new Tina template never crashes the site.
import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useState, type FormEvent, type ReactNode } from "react";
import { tinaField, useEditState } from "tinacms/dist/react";
import { TinaMarkdown, type TinaMarkdownContent } from "tinacms/dist/rich-text";

type RichTextValue = string | TinaMarkdownContent | null;

type ServiceItem = {
  title?: string | null;
  kicker?: string | null;
  body?: RichTextValue;
  image?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  url?: string | null;
};
type GalleryItem = { image?: string | null; caption?: string | null };
type ReviewItem = { body?: RichTextValue; author?: string | null };
type FaqItem = { title?: string | null; text?: RichTextValue };
type Item = ServiceItem & GalleryItem & ReviewItem & FaqItem;

type Section = {
  __typename?: string;
  type?: string;
  headline?: string | null;
  kicker?: string | null;
  date?: string | null;
  caption?: string | null;
  body?: RichTextValue;
  image?: string | null;
  imageAlt?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  email?: string | null;
  videoUrl?: string | null;
  embedUrl?: string | null;
  embedTitle?: string | null;
  tone?: string | null;
  panelTone?: string | null;
  buttonTone?: string | null;
  headlineSize?: string | null;
  bodySize?: string | null;
  items?: Item[] | null;
};

type Settings = {
  name?: string | null;
  logo?: string | null;
  nav?: { label: string; href: string }[] | null;
  social?: { platform: string; url: string }[] | null;
  footerLink?: string | null;
  footerLinkLabel?: string | null;
};

type JumpItem = { id: string; label: string };

const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
const CONTACT_LINK = "/#contact-1";

const EditorContext = createContext(false);
function useEditor() {
  return useContext(EditorContext);
}

const TONES = ["paper", "white", "panel", "yellow", "cyan", "dark"];
const PANEL_TONES = ["paper", "white", "panel", "yellow", "cyan", "dark"];
const BUTTON_TONES = ["dark", "light", "yellow", "cyan", "paper", "outline"];
const SIZES = ["small", "normal", "large", "xl"];

const LEGACY_SECTION_BASE: Record<string, string> = {
  Intro: "introduction",
  Services: "services",
  Gallery: "gallery",
  QuoteBanner: "quotebanner",
  ImageBanner: "imagebanner",
  Scheduling: "scheduling",
  Reviews: "customerreviews",
  Faq: "frequentlyaskedquestions",
  Contact: "contact",
  Article: "article",
  TextBanner: "textbanner",
  LogoGrid: "logogrid",
  Newsletter: "newsletter",
  Team: "team",
  Video: "video",
  CodeEmbed: "codeembed",
};

const SECTION_LABELS: Record<string, string> = {
  Intro: "Hero",
  Services: "Programs",
  Gallery: "Photos",
  QuoteBanner: "Quote",
  ImageBanner: "Photo strip",
  Scheduling: "Schedule",
  Reviews: "Reviews",
  Faq: "FAQ",
  Contact: "Contact",
  Article: "Article",
  TextBanner: "Text banner",
  LogoGrid: "Logo grid",
  Newsletter: "Newsletter",
  Team: "Team",
  Video: "Video",
  CodeEmbed: "Embed",
};

function Picture({ src, alt = "", className }: { src?: string | null; alt?: string; className?: string }) {
  if (!src) return null;
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} width={1600} height={1000} className={className} unoptimized />;
  }
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

function field(parent: unknown, path: string) {
  return { "data-tina-field": tinaField(parent as never, path) };
}
type FieldAttrs = ReturnType<typeof field>;

function external(url?: string | null) {
  return !!url && /^https?:\/\//.test(url);
}

function preset(value: string | null | undefined, allowed: string[], fallback: string) {
  return value && allowed.includes(value) ? value : fallback;
}

function sectionTone(tone?: string | null) {
  return tone && TONES.includes(tone) ? ` solo-section-tone-${tone}` : "";
}

function panelTone(tone?: string | null) {
  return tone && PANEL_TONES.includes(tone) ? ` solo-panel-tone-${tone}` : "";
}

function buttonClass(tone?: string | null, fallback = "dark") {
  return `solo-btn solo-btn-${preset(tone, BUTTON_TONES, fallback)}`;
}

function sizeClass(kind: "headline" | "body", size?: string | null) {
  return `solo-text-${kind}-${preset(size, SIZES, "normal")}`;
}

function sectionKind(section: Section) {
  return section.__typename?.replace(/^PageSections/, "") ?? section.type ?? "";
}

function sectionIdList(sections: Section[]): string[] {
  const counts = new Map<string, number>();
  return sections.map((section) => {
    const kind = sectionKind(section);
    const raw = LEGACY_SECTION_BASE[kind] ?? (kind.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() || "section");
    const base = raw.replace(/[^a-z0-9-]/g, "");
    const next = (counts.get(base) ?? 0) + 1;
    counts.set(base, next);
    return `${base}-${next}`;
  });
}

function sectionLabel(section: Section, index: number) {
  const kind = sectionKind(section);
  const name = SECTION_LABELS[kind] ?? kind ?? "Section";
  const text = plainText(section.headline) ?? plainText(section.kicker) ?? plainText(section.body);
  const clean = text?.replace(/\s+/g, " ").trim();
  const short = clean && clean.length > 34 ? `${clean.slice(0, 33)}…` : clean;
  return short || `${name} ${index + 1}`;
}

function EditBadge({ label }: { label: string }) {
  if (!useEditor()) return null;
  return <span className="solo-edit-badge">{label}</span>;
}

function Heading({
  as = "h2",
  text,
  fieldAttrs,
  size,
  className,
  label = "Edit headline",
}: {
  as?: "h1" | "h2";
  text?: string | null;
  fieldAttrs?: FieldAttrs;
  size?: string | null;
  className?: string;
  label?: string;
}) {
  const Tag = as;
  return (
    <Tag className={[className, sizeClass("headline", size)].filter(Boolean).join(" ")} {...fieldAttrs}>
      {text}<EditBadge label={label} />
    </Tag>
  );
}

function Copy({
  text,
  fieldAttrs,
  size,
  className,
  label = "Edit text",
}: {
  text?: RichTextValue;
  fieldAttrs?: FieldAttrs;
  size?: string | null;
  className?: string;
  label?: string;
}) {
  return (
    <div className={[className, sizeClass("body", size)].filter(Boolean).join(" ")} {...fieldAttrs}>
      <RichText text={text} /><EditBadge label={label} />
    </div>
  );
}

function Photo({
  src,
  alt,
  fieldAttrs,
  className,
  label = "Edit photo",
}: {
  src?: string | null;
  alt?: string;
  fieldAttrs?: FieldAttrs;
  className?: string;
  label?: string;
}) {
  return (
    <div className={["solo-photo", className].filter(Boolean).join(" ")} {...fieldAttrs}>
      <Picture src={src} alt={alt} /><EditBadge label={label} />
    </div>
  );
}

function Cta({
  label,
  url,
  className = "solo-btn",
  fieldAttrs,
}: {
  label?: string | null;
  url?: string | null;
  className?: string;
  fieldAttrs?: FieldAttrs;
}) {
  if (!label) return null;
  const href = url || CONTACT_LINK;
  const props = external(href) ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <a href={href} className={className} {...fieldAttrs} {...props}>
      {label}<EditBadge label="Edit button" />
    </a>
  );
}

function Carousel<T>({ items, render, label }: { items: T[]; render: (item: T, index: number) => ReactNode; label: string }) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  if (!count) return null;
  const current = ((index % count) + count) % count;
  return (
    <div className="solo-carousel">
      <div className="solo-carousel-stage">{render(items[current], current)}</div>
      <div className="solo-carousel-controls">
        <button type="button" aria-label={`Previous ${label}`} onClick={() => setIndex((index - 1 + count) % count)}>‹</button>
        <span className="solo-page-indicator">{current + 1} / {count}</span>
        <button type="button" aria-label={`Next ${label}`} onClick={() => setIndex((index + 1) % count)}>›</button>
      </div>
    </div>
  );
}

function SocialIcon({ platform }: { platform?: string | null }) {
  const name = (platform ?? "").toLowerCase();
  if (name === "instagram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  }
  if (name === "facebook") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 8.5V6.7c0-.8.5-1 1-1h2.2V2.8h-3c-2.6 0-3.7 1.7-3.7 3.9v1.8H9v3.3h2V21h3.5v-9.2h2.7l.5-3.3h-3.2Z" fill="currentColor" stroke="none" /></svg>;
  }
  if (name === "tiktok") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 2h2.6c.2 1.8 1.3 3.1 3.2 3.3v2.7c-1.2 0-2.3-.4-3.2-1v5.9c0 4-3.2 6.7-6.6 6.1-2.8-.5-4.7-3-4.6-5.8.1-3.2 3-5.6 6.2-5.3v2.8c-1.9-.4-3.6.8-3.7 2.6-.1 1.7 1.2 3.2 2.9 3.3 1.9.1 3.3-1.4 3.3-3.2V2Z" fill="currentColor" stroke="none" /></svg>;
  }
  return <span className="solo-social-fallback">{platform}</span>;
}

function videoEmbedUrl(url?: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").pop() ?? "";
      return /^[\w-]+$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return /^[\w-]+$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop() ?? "";
      return /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function safeEmbedUrl(url?: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const allowed = [
      "youtube.com", "youtube-nocookie.com", "youtu.be", "vimeo.com", "player.vimeo.com",
      "docs.google.com", "calendar.google.com", "open.spotify.com", "soundcloud.com",
    ];
    return parsed.protocol === "https:" && allowed.includes(host) ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function EditJumpBar({ items }: { items: JumpItem[] }) {
  if (!useEditor()) return null;
  return (
    <nav className="solo-edit-jump" aria-label="Edit sections">
      <strong>Edit sections</strong>
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`}>{item.label}</a>
      ))}
    </nav>
  );
}

export function Blocks({ page, settings }: { page: { title?: string; sections?: Section[] }; settings?: Settings }) {
  const sections = page.sections ?? [];
  const [menuOpen, setMenuOpen] = useState(false);
  const { edit } = useEditState();
  const ids = sectionIdList(sections);
  const jumpItems = sections.map((section, index) => ({ id: ids[index], label: sectionLabel(section, index) }));

  return (
    <EditorContext.Provider value={edit}>
      <div className="solo-shell">
        <header className="solo-header">
          <div className="solo-header-inner">
            <Link href="/" className="solo-logo" aria-label={settings?.name ?? "Home"} {...field(settings, "logo")}>
              <Picture src={settings?.logo} alt={settings?.name ?? ""} className="solo-logo-img" />
            </Link>
            <nav className="solo-nav" aria-label="Main navigation">
              {(settings?.nav ?? []).map((item, i) => (
                <Link key={`${item.href}-${item.label}`} href={item.href} className="solo-nav-link" {...field(settings, `nav.${i}.label`)}>{item.label}</Link>
              ))}
            </nav>
            <div className="solo-social">
              {(settings?.social ?? []).map((item, i) => (
                <a key={item.url} href={item.url} target="_blank" rel="noreferrer" aria-label={item.platform} {...field(settings, `social.${i}.url`)}>
                  <SocialIcon platform={item.platform} />
                </a>
              ))}
            </div>
            <button type="button" className="solo-menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              <span /><span /><span />
            </button>
          </div>
          {menuOpen ? (
            <nav className="solo-mobile-nav" aria-label="Mobile navigation">
              {(settings?.nav ?? []).map((item, i) => (
                <Link key={`m-${item.href}-${item.label}`} href={item.href} onClick={() => setMenuOpen(false)} {...field(settings, `nav.${i}.label`)}>{item.label}</Link>
              ))}
              <div className="solo-mobile-social">
                {(settings?.social ?? []).map((item, i) => (
                  <a key={`m-${item.url}`} href={item.url} target="_blank" rel="noreferrer" aria-label={item.platform} {...field(settings, `social.${i}.url`)}>
                    <SocialIcon platform={item.platform} />
                  </a>
                ))}
              </div>
            </nav>
          ) : null}
        </header>

        <EditJumpBar items={jumpItems} />

        <main className="solo-main">
          {sections.map((section, index) => (
            <Section key={index} section={section} parent={page} index={index} id={ids[index]} />
          ))}
        </main>

        <footer className="solo-footer">
          <div className="solo-footer-inner">
            <Link href="/" className="solo-footer-logo" {...field(settings, "logo")}>
              <Picture src={settings?.logo} alt={settings?.name ?? ""} className="solo-logo-img" />
            </Link>
            <div className="solo-footer-body">
              {settings?.footerLink ? (
                <a href={settings.footerLink} target="_blank" rel="noreferrer" className="solo-footer-link" {...field(settings, "footerLinkLabel")}>
                  {settings.footerLinkLabel ?? settings.footerLink}
                </a>
              ) : null}
              <p className="solo-copyright">© {new Date().getFullYear()} {settings?.name}</p>
            </div>
          </div>
        </footer>
      </div>
    </EditorContext.Provider>
  );
}

function Section({ section, parent, index, id }: { section: Section; parent: unknown; index: number; id: string }) {
  const f = (name: string) => field(parent, `sections.${index}.${name}`);
  const items = section.items ?? [];
  const itemField = (i: number, name: string) => field(parent, `sections.${index}.items.${i}.${name}`);
  const kind = sectionKind(section);

  switch (kind) {
    case "Intro":
      return (
        <section id={id} className={`solo-intro${sectionTone(section.tone)}`} style={{ backgroundImage: `linear-gradient(rgba(23,23,23,.75), rgba(23,23,23,.75)), url("${section.image ?? ""}")` }}>
          <div className="solo-container solo-intro-inner">
            <Heading as="h1" text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} label="Edit main headline" />
            <Copy text={section.body} fieldAttrs={f("body")} size={section.bodySize} className="solo-intro-copy" label="Edit intro text" />
            <div className="solo-intro-cta">
              <Cta label={section.ctaLabel} url={section.ctaUrl} className={buttonClass(section.buttonTone, "light")} fieldAttrs={f("ctaLabel")} />
            </div>
            <div {...f("image")}><EditBadge label="Edit background photo" /></div>
          </div>
        </section>
      );

    case "Services":
      return (
        <section id={id} className={`solo-panel solo-services${sectionTone(section.tone)}`}>
          <div className="solo-container">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
            <div className="solo-service-grid">
              {items.map((item, i) => (
                <article key={i} className={`solo-service-card${panelTone(section.panelTone)}`}>
                  <Photo src={item.image} alt={item.title ?? ""} fieldAttrs={itemField(i, "image")} className="solo-service-image" />
                  <h3 {...itemField(i, "title")}>{item.title}<EditBadge label="Edit card title" /></h3>
                  {item.kicker ? <h4 {...itemField(i, "kicker")}>{item.kicker}<EditBadge label="Edit small heading" /></h4> : null}
                  <Copy text={item.body} fieldAttrs={itemField(i, "body")} size={section.bodySize} label="Edit card text" />
                  <Cta label={item.ctaLabel} url={item.ctaUrl} className={buttonClass(section.buttonTone, "dark")} fieldAttrs={itemField(i, "ctaLabel")} />
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    case "Gallery":
      return (
        <section id={id} className={`solo-panel solo-gallery${sectionTone(section.tone)}`}>
          <div className="solo-container">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
            <Carousel
              items={items}
              label="photo"
              render={(item, i) => (
                <figure className="solo-gallery-item">
                  <Photo src={item.image} alt={item.caption ?? ""} fieldAttrs={itemField(i, "image")} className="solo-gallery-photo" />
                  <figcaption {...itemField(i, "caption")}>{item.caption}<EditBadge label="Edit caption" /></figcaption>
                </figure>
              )}
            />
          </div>
        </section>
      );

    case "QuoteBanner":
      return (
        <section id={id} className={`solo-quote-banner${sectionTone(section.tone)}`}>
          <div className="solo-container solo-banner-inner">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} />
            <Copy text={section.body} fieldAttrs={f("body")} size={section.bodySize} />
          </div>
        </section>
      );

    case "ImageBanner":
      return (
        <section id={id} className={`solo-image-banner${sectionTone(section.tone)}`} style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.2)), url("${section.image ?? ""}")` }} {...f("image")}>
          <EditBadge label="Edit wide photo" />
        </section>
      );

    case "Scheduling":
      return (
        <section id={id} className={`solo-scheduling${sectionTone(section.tone)}`}>
          <div className="solo-container solo-banner-inner">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} />
            <Copy text={section.body} fieldAttrs={f("body")} size={section.bodySize} />
            <Cta label={section.ctaLabel} url={section.ctaUrl} className={buttonClass(section.buttonTone, "dark")} fieldAttrs={f("ctaLabel")} />
          </div>
        </section>
      );

    case "Reviews":
      return (
        <section id={id} className={`solo-panel solo-reviews${sectionTone(section.tone)}`}>
          <div className="solo-container">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
            <Carousel
              items={items}
              label="review"
              render={(item, i) => (
                <blockquote className={`solo-review${panelTone(section.panelTone)}`} {...itemField(i, "body")}>
                  <RichText text={item.body} />
                  <cite {...itemField(i, "author")}>{item.author}<EditBadge label="Edit reviewer" /></cite>
                  <EditBadge label="Edit review text" />
                </blockquote>
              )}
            />
          </div>
        </section>
      );

    case "Faq":
      return (
        <section id={id} className={`solo-faq${sectionTone(section.tone)}`}>
          <div className="solo-container solo-faq-inner">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
            <FaqList items={items} parent={parent} sectionIndex={index} bodySize={section.bodySize} />
          </div>
        </section>
      );

    case "Contact":
      return (
        <section id={id} className={`solo-contact${sectionTone(section.tone)}`}>
          <div className="solo-container solo-contact-inner">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
            <a href={`mailto:${section.email ?? "teachertravelingworld@gmail.com"}`} className="solo-contact-email" {...f("email")}>
              {section.email ?? "teachertravelingworld@gmail.com"}<EditBadge label="Edit email" />
            </a>
            <ContactForm email={section.email ?? "teachertravelingworld@gmail.com"} buttonClass={buttonClass(section.buttonTone, "dark")} />
          </div>
        </section>
      );

    case "Article":
      return (
        <section id={id} className={`solo-panel solo-article${sectionTone(section.tone)}`}>
          <div className="solo-container solo-article-inner">
            {section.image ? <Photo src={section.image} alt={section.imageAlt ?? ""} fieldAttrs={f("image")} className="solo-article-photo" /> : null}
            <div className="solo-article-copy">
              {section.kicker || section.date ? (
                <p className="solo-eyebrow" {...f(section.kicker ? "kicker" : "date")}>
                  {section.kicker ?? section.date}<EditBadge label="Edit label" />
                </p>
              ) : null}
              <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
              <Copy text={section.body} fieldAttrs={f("body")} size={section.bodySize} />
              <Cta label={section.ctaLabel} url={section.ctaUrl} className={buttonClass(section.buttonTone, "dark")} fieldAttrs={f("ctaLabel")} />
            </div>
          </div>
        </section>
      );

    case "TextBanner":
      return (
        <section id={id} className={`solo-text-banner${sectionTone(section.tone ?? "yellow")}`}>
          <div className="solo-container solo-banner-inner">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} />
            <Copy text={section.body} fieldAttrs={f("body")} size={section.bodySize} />
            <Cta label={section.ctaLabel} url={section.ctaUrl} className={buttonClass(section.buttonTone, "dark")} fieldAttrs={f("ctaLabel")} />
          </div>
        </section>
      );

    case "LogoGrid":
      return (
        <section id={id} className={`solo-panel solo-logo-grid${sectionTone(section.tone)}`}>
          <div className="solo-container">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
            <div className="solo-logo-grid-list">
              {items.map((item, i) => {
                const logo = (
                  <Photo src={item.image} alt={item.title ?? ""} fieldAttrs={itemField(i, "image")} className="solo-logo-tile" />
                );
                return item.url ? (
                  <a key={i} href={item.url} target="_blank" rel="noreferrer" {...itemField(i, "url")}>
                    {logo}<span className="solo-logo-name">{item.title}<EditBadge label="Edit name" /></span>
                  </a>
                ) : (
                  <div key={i}>
                    {logo}<span className="solo-logo-name" {...itemField(i, "title")}>{item.title}<EditBadge label="Edit name" /></span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );

    case "Newsletter":
      return (
        <section id={id} className={`solo-newsletter${sectionTone(section.tone ?? "panel")}`}>
          <div className="solo-container solo-newsletter-inner">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
            <Copy text={section.body} fieldAttrs={f("body")} size={section.bodySize} />
            <NewsletterForm
              email={section.email ?? "teachertravelingworld@gmail.com"}
              label={section.ctaLabel ?? "Subscribe"}
              buttonClass={buttonClass(section.buttonTone, "dark")}
            />
            <p className="solo-newsletter-email" {...f("email")}>
              Sent to {section.email ?? "teachertravelingworld@gmail.com"}<EditBadge label="Edit destination email" />
            </p>
          </div>
        </section>
      );

    case "Team":
      return (
        <section id={id} className={`solo-panel solo-team${sectionTone(section.tone)}`}>
          <div className="solo-container">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
            <div className="solo-team-grid">
              {items.map((item, i) => (
                <article key={i} className={`solo-team-card${panelTone(section.panelTone)}`}>
                  <Photo src={item.image} alt={item.title ?? ""} fieldAttrs={itemField(i, "image")} className="solo-team-photo" />
                  <h3 {...itemField(i, "title")}>{item.title}<EditBadge label="Edit name" /></h3>
                  {item.kicker ? <p className="solo-team-role" {...itemField(i, "kicker")}>{item.kicker}<EditBadge label="Edit role" /></p> : null}
                  <Copy text={item.body} fieldAttrs={itemField(i, "body")} size={section.bodySize} label="Edit bio" />
                  {item.url ? <a href={item.url} target="_blank" rel="noreferrer" {...itemField(i, "url")}>Profile<EditBadge label="Edit profile link" /></a> : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    case "Video":
      return (
        <section id={id} className={`solo-panel solo-video${sectionTone(section.tone)}`}>
          <div className="solo-container">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
            <div className="solo-video-frame" {...f("videoUrl")}>
              {videoEmbedUrl(section.videoUrl) ? (
                <iframe
                  src={videoEmbedUrl(section.videoUrl) ?? undefined}
                  title={section.embedTitle ?? section.headline ?? "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : null}
              <EditBadge label="Edit video link" />
            </div>
            {section.caption ? <p className="solo-video-caption" {...f("caption")}>{section.caption}<EditBadge label="Edit caption" /></p> : null}
            <Copy text={section.body} fieldAttrs={f("body")} size={section.bodySize} />
          </div>
        </section>
      );

    case "CodeEmbed": {
      const embed = safeEmbedUrl(section.embedUrl);
      return (
        <section id={id} className={`solo-panel solo-embed${sectionTone(section.tone)}`}>
          <div className="solo-container">
            <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" />
            <div className="solo-embed-frame" {...f("embedUrl")}>
              {embed ? (
                <iframe
                  src={embed}
                  title={section.embedTitle ?? section.headline ?? "Embedded content"}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                />
              ) : null}
              <EditBadge label="Edit embed link" />
            </div>
            {section.caption ? <p className="solo-video-caption" {...f("caption")}>{section.caption}<EditBadge label="Edit caption" /></p> : null}
          </div>
        </section>
      );
    }

    default:
      return (
        <section id={id} className={`solo-panel solo-generic${sectionTone(section.tone)}`}>
          <div className="solo-container">
            {section.headline ? <Heading text={section.headline} fieldAttrs={f("headline")} size={section.headlineSize} className="solo-heading" /> : null}
            {section.body ? <Copy text={section.body} fieldAttrs={f("body")} size={section.bodySize} /> : null}
            {section.image ? <Photo src={section.image} alt={section.imageAlt ?? ""} fieldAttrs={f("image")} className="solo-generic-photo" /> : null}
            <Cta label={section.ctaLabel} url={section.ctaUrl} className={buttonClass(section.buttonTone, "dark")} fieldAttrs={f("ctaLabel")} />
          </div>
        </section>
      );
  }
}

function FaqList({
  items,
  parent,
  sectionIndex,
  bodySize,
}: {
  items: FaqItem[];
  parent: unknown;
  sectionIndex: number;
  bodySize?: string | null;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="solo-faq-list">
      {items.map((item, i) => (
        <div key={i} className={`solo-faq-item ${open === i ? "expanded" : ""}`}>
          <button type="button" className="solo-faq-heading" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span {...field(parent, `sections.${sectionIndex}.items.${i}.title`)}>{item.title}<EditBadge label="Edit question" /></span>
            <span className="solo-chevron" aria-hidden="true">⌄</span>
          </button>
          <div className={`solo-faq-body ${sizeClass("body", bodySize)}`} {...field(parent, `sections.${sectionIndex}.items.${i}.text`)}>
            <RichText text={item.text} /><EditBadge label="Edit answer" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactForm({ email, buttonClass: className }: { email: string; buttonClass: string }) {
  const fields = [
    { name: "email", label: "Email address *", type: "email", required: true },
    { name: "name", label: "Name *", type: "text", required: true },
    { name: "phone", label: "Phone number", type: "tel", required: false },
    { name: "message", label: "Message *", type: "textarea", required: true },
  ];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (FORM_ENDPOINT) return;
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Name: ${data.get("name") ?? ""}\nEmail: ${data.get("email") ?? ""}\nPhone: ${data.get("phone") ?? ""}\n\n${data.get("message") ?? ""}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Teacher Traveling enquiry")}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      action={FORM_ENDPOINT || undefined}
      method={FORM_ENDPOINT ? "post" : undefined}
      onSubmit={onSubmit}
      className="solo-contact-form"
    >
      {fields.map((item) => (
        <label key={item.name} className="solo-field">
          <span>{item.label}</span>
          {item.type === "textarea" ? (
            <textarea name={item.name} rows={5} required={item.required} />
          ) : (
            <input name={item.name} type={item.type} required={item.required} />
          )}
        </label>
      ))}
      <input type="text" name="_gotcha" className="solo-honey" tabIndex={-1} autoComplete="off" />
      <button type="submit" className={className}>Contact Us</button>
    </form>
  );
}

function NewsletterForm({ email, label, buttonClass: className }: { email: string; label: string; buttonClass: string }) {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (FORM_ENDPOINT) return;
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subscriber = String(data.get("email") ?? "");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Teacher Traveling newsletter")}&body=${encodeURIComponent(`Please add ${subscriber} to the newsletter list.`)}`;
  }

  return (
    <form action={FORM_ENDPOINT || undefined} method={FORM_ENDPOINT ? "post" : undefined} onSubmit={onSubmit} className="solo-newsletter-form">
      <label className="solo-field">
        <span>Email address *</span>
        <input type="email" name="email" required />
      </label>
      <button type="submit" className={className}>{label}</button>
    </form>
  );
}
