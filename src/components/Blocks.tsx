"use client";
// One component per Solo section type. Unknown types fall through to the generic
// renderer, so a new Tina template never crashes the site.
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown, type TinaMarkdownContent } from "tinacms/dist/rich-text";

type RichTextValue = string | TinaMarkdownContent | null;

type ServiceItem = {
  title?: string | null;
  kicker?: string | null;
  body?: RichTextValue;
  image?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
};
type GalleryItem = { image?: string | null; caption?: string | null };
type ReviewItem = { body?: RichTextValue; author?: string | null };
type FaqItem = { title?: string | null; text?: RichTextValue };
type Item = ServiceItem & GalleryItem & ReviewItem & FaqItem;

type Section = {
  __typename?: string;
  type?: string;
  headline?: string | null;
  body?: RichTextValue;
  image?: string | null;
  imageAlt?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  email?: string | null;
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

const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
const CONTACT_LINK = "/#contact-1";

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

function Cta({ label, url, className = "solo-btn", fieldAttrs }: { label?: string | null; url?: string | null; className?: string; fieldAttrs?: FieldAttrs }) {
  if (!label) return null;
  const href = url || CONTACT_LINK;
  const props = external(href) ? { target: "_blank", rel: "noreferrer" } : {};
  return <a href={href} className={className} {...fieldAttrs} {...props}>{label}</a>;
}

function Carousel<T>({ items, render, label }: { items: T[]; render: (item: T, index: number) => React.ReactNode; label: string }) {
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

export function Blocks({ page, settings }: { page: { title?: string; sections?: Section[] }; settings?: Settings }) {
  const sections = page.sections ?? [];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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

      <main className="solo-main">
        {sections.map((section, index) => (
          <Section key={index} section={section} parent={page} index={index} />
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
  );
}

function Section({ section, parent, index }: { section: Section; parent: unknown; index: number }) {
  const f = (name: string) => field(parent, `sections.${index}.${name}`);
  const kind = section.__typename?.replace(/^PageSections/, "") ?? section.type ?? "";
  const items = section.items ?? [];

  switch (kind) {
    case "Intro":
      return (
        <section id="introduction-1" className="solo-intro" style={{ backgroundImage: `linear-gradient(rgba(23,23,23,.75), rgba(23,23,23,.75)), url("${section.image ?? ""}")` }}>
          <div className="solo-container solo-intro-inner">
            <h1 {...f("headline")}>{section.headline}</h1>
            <div className="solo-intro-copy" {...f("body")}><RichText text={section.body} /></div>
            <div className="solo-intro-cta"><Cta label={section.ctaLabel} url={section.ctaUrl} className="solo-btn solo-btn-light" fieldAttrs={f("ctaLabel")} /></div>
          </div>
        </section>
      );

    case "Services":
      return (
        <section id="services-1" className="solo-panel solo-services">
          <div className="solo-container">
            <h2 className="solo-heading" {...f("headline")}>{section.headline}</h2>
            <div className="solo-service-grid">
              {items.map((item, i) => (
                <article key={i} className="solo-service-card">
                  <div className="solo-service-image" {...field(parent, `sections.${index}.items.${i}.image`)}>
                    <Picture src={item.image} alt={item.title ?? ""} />
                  </div>
                  <h3 {...field(parent, `sections.${index}.items.${i}.title`)}>{item.title}</h3>
                  {item.kicker ? <h4 {...field(parent, `sections.${index}.items.${i}.kicker`)}>{item.kicker}</h4> : null}
                  <div {...field(parent, `sections.${index}.items.${i}.body`)}><RichText text={item.body} /></div>
                  <Cta
                    label={item.ctaLabel}
                    url={item.ctaUrl}
                    className="solo-btn solo-btn-dark"
                    fieldAttrs={field(parent, `sections.${index}.items.${i}.ctaLabel`)}
                  />
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    case "Gallery":
      return (
        <section id="gallery-1" className="solo-panel solo-gallery">
          <div className="solo-container">
            <h2 className="solo-heading" {...f("headline")}>{section.headline}</h2>
            <Carousel
              items={items}
              label="photo"
              render={(item, i) => (
                <figure className="solo-gallery-item">
                  <div {...field(parent, `sections.${index}.items.${i}.image`)}>
                    <Picture src={item.image} alt={item.caption ?? ""} />
                  </div>
                  <figcaption {...field(parent, `sections.${index}.items.${i}.caption`)}>{item.caption}</figcaption>
                </figure>
              )}
            />
          </div>
        </section>
      );

    case "QuoteBanner":
      return (
        <section id="quotebanner-1" className="solo-quote-banner">
          <div className="solo-container solo-banner-inner">
            <h2 {...f("headline")}>{section.headline}</h2>
            <div {...f("body")}><RichText text={section.body} /></div>
          </div>
        </section>
      );

    case "ImageBanner":
      return (
        <section id="imagebanner-1" className="solo-image-banner" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.2)), url("${section.image ?? ""}")` }} {...f("image")} aria-hidden="true" />
      );

    case "Scheduling":
      return (
        <section id="scheduling-1" className="solo-scheduling">
          <div className="solo-container solo-banner-inner">
            <h2 {...f("headline")}>{section.headline}</h2>
            <div {...f("body")}><RichText text={section.body} /></div>
            <Cta label={section.ctaLabel} url={section.ctaUrl} className="solo-btn solo-btn-dark" fieldAttrs={f("ctaLabel")} />
          </div>
        </section>
      );

    case "Reviews":
      return (
        <section id="customerreviews-1" className="solo-panel solo-reviews">
          <div className="solo-container">
            <h2 className="solo-heading" {...f("headline")}>{section.headline}</h2>
            <Carousel
              items={items}
              label="review"
              render={(item, i) => (
                <blockquote className="solo-review" {...field(parent, `sections.${index}.items.${i}.body`)}>
                  <RichText text={item.body} />
                  <cite {...field(parent, `sections.${index}.items.${i}.author`)}>{item.author}</cite>
                </blockquote>
              )}
            />
          </div>
        </section>
      );

    case "Faq":
      return (
        <section id="frequentlyaskedquestions-1" className="solo-faq">
          <div className="solo-container solo-faq-inner">
            <h2 className="solo-heading" {...f("headline")}>{section.headline}</h2>
            <FaqList items={items} parent={parent} sectionIndex={index} />
          </div>
        </section>
      );

    case "Contact":
      return (
        <section id="contact-1" className="solo-contact">
          <div className="solo-container solo-contact-inner">
            <h2 className="solo-heading" {...f("headline")}>{section.headline}</h2>
            <a href={`mailto:${section.email ?? "teachertravelingworld@gmail.com"}`} className="solo-contact-email" {...f("email")}>
              {section.email ?? "teachertravelingworld@gmail.com"}
            </a>
            <ContactForm email={section.email ?? "teachertravelingworld@gmail.com"} />
          </div>
        </section>
      );

    default:
      return (
        <section className="solo-panel solo-generic">
          <div className="solo-container">
            {section.headline ? <h2 className="solo-heading" {...f("headline")}>{section.headline}</h2> : null}
            {section.body ? <div {...f("body")}><RichText text={section.body} /></div> : null}
            {section.image ? <div {...f("image")}><Picture src={section.image} alt={section.imageAlt ?? ""} className="solo-generic-image" /></div> : null}
            <Cta label={section.ctaLabel} url={section.ctaUrl} className="solo-btn solo-btn-dark" fieldAttrs={f("ctaLabel")} />
          </div>
        </section>
      );
  }
}

function FaqList({ items, parent, sectionIndex }: { items: FaqItem[]; parent: unknown; sectionIndex: number }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="solo-faq-list">
      {items.map((item, i) => (
        <div key={i} className={`solo-faq-item ${open === i ? "expanded" : ""}`}>
          <button type="button" className="solo-faq-heading" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span {...field(parent, `sections.${sectionIndex}.items.${i}.title`)}>{item.title}</span>
            <span className="solo-chevron" aria-hidden="true">⌄</span>
          </button>
          <div className="solo-faq-body" {...field(parent, `sections.${sectionIndex}.items.${i}.text`)}>
            <RichText text={item.text} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactForm({ email }: { email: string }) {
  const fields = [
    { name: "email", label: "Email address *", type: "email", required: true },
    { name: "name", label: "Name *", type: "text", required: true },
    { name: "phone", label: "Phone number", type: "tel", required: false },
    { name: "message", label: "Message *", type: "textarea", required: true },
  ];

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      <button type="submit" className="solo-btn solo-btn-dark">Contact Us</button>
    </form>
  );
}
