import React from "react";
import { defineConfig } from "tinacms";

/**
 * Teacher Traveling, rebuilt from the Mozilla Solo export.
 * Each section maps to one visual block from the original page.
 * Editor labels and helper text are tuned for non-technical maintenance.
 * Schema synchronized with the homepage content.
 */
const CHECKLIST_KEY = "teacher-traveling-editor-checklist";

const EDITOR_STEPS = [
  { title: "Open the homepage", text: "Open Homepage in the left menu. Tina shows the live page beside the form." },
  { title: "Click something on the page", text: "Click a headline, paragraph, photo, or button. Tina jumps to that field." },
  { title: "Edit in the sidebar", text: "Type in the sidebar. The page changes as you type. Use the size and color menus here." },
  { title: "Replace a photo", text: "Open the Media tab, choose an uploaded image, then pick it in the photo field." },
  { title: "Save", text: "Press Save. Tina sends the change to GitHub and the public site updates." },
];

const TONE_OPTIONS = [
  { label: "Keep original", value: "" },
  { label: "White", value: "white" },
  { label: "Light grey", value: "panel" },
  { label: "Yellow", value: "yellow" },
  { label: "Blue", value: "cyan" },
  { label: "Dark", value: "dark" },
];
const PANEL_TONE_OPTIONS = TONE_OPTIONS.filter((option) => option.value !== "");
const BUTTON_TONE_OPTIONS = [
  { label: "Keep original", value: "" },
  { label: "Dark", value: "dark" },
  { label: "White", value: "light" },
  { label: "Yellow", value: "yellow" },
  { label: "Blue", value: "cyan" },
  { label: "Outline", value: "outline" },
];
const SIZE_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "Small", value: "small" },
  { label: "Large", value: "large" },
  { label: "Extra large", value: "xl" },
];

function colorFields(): any[] {
  return [
    {
      name: "tone",
      label: "Section color",
      type: "string",
      options: TONE_OPTIONS,
      ui: { description: "Optional. Choose a swatch to change this section. Leave on Keep original to match the current site." },
    },
    {
      name: "panelTone",
      label: "Card color",
      type: "string",
      options: PANEL_TONE_OPTIONS,
      ui: { description: "Optional. Changes cards or panels inside this section only." },
    },
    {
      name: "buttonTone",
      label: "Button color",
      type: "string",
      options: BUTTON_TONE_OPTIONS,
      ui: { description: "Optional. Changes buttons inside this section only." },
    },
  ];
}

function sizeFields(): any[] {
  return [
    {
      name: "headlineSize",
      label: "Headline size",
      type: "string",
      options: SIZE_OPTIONS,
      ui: { description: "Visual size for the main heading in this section." },
    },
    {
      name: "bodySize",
      label: "Text size",
      type: "string",
      options: SIZE_OPTIONS,
      ui: { description: "Visual size for paragraphs in this section." },
    },
  ];
}

function SeoTitleField({ input, field }: any) {
  const title = input.value || "Teacher Traveling";
  return React.createElement(
    "div",
    { style: { marginBottom: "16px" } },
    React.createElement("label", { htmlFor: input.name, style: { display: "block", marginBottom: "4px", fontWeight: 600 } }, field.label),
    React.createElement("input", {
      ...input,
      id: input.name,
      style: { width: "100%", padding: "8px", border: "1px solid #cfcfd8", borderRadius: "4px", fontFamily: "inherit" },
    }),
    React.createElement(
      "div",
      { style: { marginTop: "8px", padding: "12px", border: "1px solid #e1e1e1", borderRadius: "6px", background: "#fff" } },
      React.createElement("div", { style: { fontSize: "12px", color: "#5b5b66" } }, "Google preview"),
      React.createElement("div", { style: { color: "#1a0dab", fontSize: "16px" } }, title),
      React.createElement("div", { style: { color: "#006621", fontSize: "12px" } }, "https://teachertraveling.com")
    )
  );
}

function EditorGuide() {
  const [done, setDone] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CHECKLIST_KEY);
      if (saved) setDone(JSON.parse(saved));
    } catch {
      // Checklist still works for this session if storage is unavailable.
    }
  }, []);

  function toggle(index: number) {
    const next = { ...done, [String(index)]: !done[String(index)] };
    setDone(next);
    try {
      window.localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
    } catch {
      // Keep the in-memory state if storage is unavailable.
    }
  }

  return React.createElement(
    "div",
    {
      style: {
        background: "#f3b000",
        border: "1px solid #cfcfd8",
        borderRadius: "8px",
        color: "#000",
        marginBottom: "24px",
        padding: "16px 20px",
      },
    },
    React.createElement("strong", null, "Start here"),
    React.createElement(
      "p",
      { style: { margin: "8px 0 0", lineHeight: "1.5" } },
      "Click text, photos, or buttons on the page to jump to that field. The blue Edit labels show what is clickable."
    ),
    React.createElement(
      "div",
      { style: { display: "grid", gap: "10px", marginTop: "14px" } },
      ...EDITOR_STEPS.map((step, index) =>
        React.createElement(
          "label",
          {
            key: step.title,
            style: { display: "grid", gridTemplateColumns: "20px 1fr", gap: "10px", alignItems: "start", cursor: "pointer" },
          },
          React.createElement("input", {
            type: "checkbox",
            checked: !!done[String(index)],
            onChange: () => toggle(index),
            style: { width: "16px", height: "16px", marginTop: "2px" },
          }),
          React.createElement(
            "span",
            null,
            React.createElement("strong", null, `${index + 1}. ${step.title}`),
            React.createElement("span", { style: { display: "block", lineHeight: "1.4" } }, step.text)
          )
        )
      )
    ),
    React.createElement(
      "p",
      { style: { margin: "14px 0 0", lineHeight: "1.5" } },
      "Use Section color, Card color, Button color, Headline size, and Text size to adjust each section visually. Do not change Colors and fonts in Site settings unless asked."
    )
  );
}

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.GITHUB_BRANCH || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "page",
        label: "Homepage",
        path: "content/pages",
        format: "md",
        match: { include: "**/*" },
        ui: {
          allowedActions: { create: false, delete: false },
          filename: {
            readonly: true,
            description: "Filename. Leave this as index.md.",
          },
          router: ({ document }) => document._sys?.filename === "index" ? "/" : undefined,
        },
        fields: [
          {
            type: "displayOnly",
            name: "editorGuide",
            label: "How to edit",
            ui: { component: EditorGuide },
          },
          {
            type: "string",
            name: "title",
            label: "Browser tab title",
            isTitle: true,
            required: true,
            ui: { description: "Text shown in the browser tab. Change only if asked." },
          },
          {
            type: "string",
            name: "description",
            label: "Search result description",
            ui: { component: "textarea", description: "Short summary used by Google. One paragraph." },
          },
          {
            name: "sections",
            label: "Page sections",
            type: "object",
            list: true,
            ui: {
              description:
                "These are the sections of the page, in order. Click a section to edit it. The label shown here comes from its headline or caption.",
            },
            templates: [
              {
                name: "intro",
                label: "Hero introduction",
                ui: {
                  previewSrc: "/uploads/travel-expands-perspective-without-it-you-.webp",
                  itemProps: (item) => ({ label: item.headline || "Hero introduction" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  {
                    name: "headline",
                    label: "Main headline",
                    type: "string",
                    required: true,
                    ui: { description: "Shown large over the dark background photo." },
                  },
                  {
                    name: "body",
                    label: "Intro paragraphs",
                    type: "rich-text",
                    ui: { description: "Short paragraphs about Cynthia. Bold and links are enough here." },
                    overrides: { toolbar: ["bold", "italic", "link"] },
                  },
                  {
                    name: "image",
                    label: "Background photo",
                    type: "image",
                    ui: { description: "Pick the wide travel photo from the image library." },
                  },
                  {
                    name: "ctaLabel",
                    label: "Button text",
                    type: "string",
                    ui: { description: "Usually 'Contact Us'." },
                  },
                  {
                    name: "ctaUrl",
                    label: "Button link",
                    type: "string",
                    ui: { description: "Use /#contact-1 to jump to the contact form." },
                  },
                ],
              },
              {
                name: "services",
                label: "Travel programs",
                ui: {
                  previewSrc: "/uploads/explore-our-travel-programs-educational-to.jpg",
                  itemProps: (item) => ({ label: item.headline || "Travel programs" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  {
                    name: "headline",
                    label: "Section headline",
                    type: "string",
                    required: true,
                  },
                  {
                    name: "items",
                    label: "Program cards",
                    type: "object",
                    list: true,
                    openFormOnCreate: true,
                    ui: {
                      description: "One card per program. The card list label comes from Card title.",
                      itemProps: (item) => ({ label: item.title || "Program card" }),
                    },
                    fields: [
                      {
                        name: "title",
                        label: "Card title",
                        type: "string",
                        required: true,
                      },
                      {
                        name: "kicker",
                        label: "Small heading",
                        type: "string",
                        ui: { description: "Optional line under the card title. Most cards leave this blank." },
                      },
                      {
                        name: "body",
                        label: "Card description",
                        type: "rich-text",
                        ui: { description: "Plain paragraphs. Add an email link only when needed." },
                        overrides: { toolbar: ["bold", "italic", "link"] },
                      },
                      {
                        name: "image",
                        label: "Round photo",
                        type: "image",
                        ui: { description: "Pick a photo from the image library. It displays as a circle." },
                      },
                      {
                        name: "ctaLabel",
                        label: "Button text",
                        type: "string",
                        ui: { description: "Leave blank when the card has no button." },
                      },
                      {
                        name: "ctaUrl",
                        label: "Button link",
                        type: "string",
                        ui: { description: "Full https:// link. Leave blank when the card has no button." },
                      },
                    ],
                  },
                ],
              },
              {
                name: "gallery",
                label: "Photo gallery",
                ui: {
                  previewSrc: "/uploads/making-memories-one-country-at-a-time.webp",
                  itemProps: (item) => ({ label: item.headline || "Photo gallery" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  {
                    name: "headline",
                    label: "Section headline",
                    type: "string",
                    required: true,
                  },
                  {
                    name: "items",
                    label: "Gallery photos",
                    type: "object",
                    list: true,
                    openFormOnCreate: true,
                    ui: {
                      description: "Visitors browse these one at a time with arrows.",
                      itemProps: (item) => ({ label: item.caption || "Gallery photo" }),
                    },
                    fields: [
                      { name: "image", label: "Photo", type: "image" },
                      {
                        name: "caption",
                        label: "Photo caption",
                        type: "string",
                        ui: { description: "Example: Tokyo, Japan 2023." },
                      },
                    ],
                  },
                ],
              },
              {
                name: "quoteBanner",
                label: "Yellow quote banner",
                ui: {
                  previewSrc: "/uploads/9f44fbac-b412-4853-8963-ebc6132ed278.webp",
                  itemProps: (item) => ({ label: item.headline || "Yellow quote banner" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Banner headline", type: "string", required: true },
                  {
                    name: "body",
                    label: "Banner text",
                    type: "rich-text",
                    ui: { description: "One short sentence." },
                    overrides: { toolbar: ["bold", "italic"] },
                  },
                ],
              },
              {
                name: "imageBanner",
                label: "Image banner",
                ui: {
                  previewSrc: "/uploads/9f44fbac-b412-4853-8963-ebc6132ed278.webp",
                  itemProps: () => ({ label: "Image banner" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  {
                    name: "image",
                    label: "Wide photo",
                    type: "image",
                    ui: { description: "Decorative strip between the quote and the blue banner." },
                  },
                ],
              },
              {
                name: "scheduling",
                label: "Blue scheduling banner",
                ui: {
                  previewSrc: "/uploads/travel-expands-perspective-without-it-you-.webp",
                  itemProps: (item) => ({ label: item.headline || "Blue scheduling banner" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Banner headline", type: "string", required: true },
                  {
                    name: "body",
                    label: "Banner text",
                    type: "rich-text",
                    overrides: { toolbar: ["bold", "italic"] },
                  },
                  { name: "ctaLabel", label: "Button text", type: "string" },
                  {
                    name: "ctaUrl",
                    label: "Button link",
                    type: "string",
                    ui: { description: "Use /#contact-1 to jump to the contact form." },
                  },
                ],
              },
              {
                name: "reviews",
                label: "Traveler reviews",
                ui: {
                  previewSrc: "/uploads/making-memories-one-country-at-a-time-2.webp",
                  itemProps: (item) => ({ label: item.headline || "Traveler reviews" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Section headline", type: "string", required: true },
                  {
                    name: "items",
                    label: "Reviews",
                    type: "object",
                    list: true,
                    openFormOnCreate: true,
                    ui: {
                      description: "Visitors browse reviews one at a time with arrows.",
                      itemProps: (item) => ({ label: item.author || "Traveler review" }),
                    },
                    fields: [
                      {
                        name: "body",
                        label: "Review text",
                        type: "rich-text",
                        ui: { description: "Paste the review as plain text. Quotation marks are added by the site." },
                        overrides: { toolbar: ["bold", "italic"] },
                      },
                      {
                        name: "author",
                        label: "Reviewer name and role",
                        type: "string",
                        ui: { description: "Example: Keila Javier - Adult traveler." },
                      },
                    ],
                  },
                ],
              },
              {
                name: "faq",
                label: "FAQ accordion",
                ui: {
                  previewSrc: "/uploads/making-memories-one-country-at-a-time-7.webp",
                  itemProps: (item) => ({ label: item.headline || "FAQ accordion" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Section headline", type: "string", required: true },
                  {
                    name: "items",
                    label: "Questions",
                    type: "object",
                    list: true,
                    openFormOnCreate: true,
                    ui: {
                      description: "Click a question to show or hide its answer on the site.",
                      itemProps: (item) => ({ label: item.title || "FAQ question" }),
                    },
                    fields: [
                      { name: "title", label: "Question", type: "string", required: true },
                      {
                        name: "text",
                        label: "Answer",
                        type: "rich-text",
                        ui: { description: "One short answer. The question title is not repeated here." },
                        overrides: { toolbar: ["bold", "italic", "link"] },
                      },
                    ],
                  },
                ],
              },
              {
                name: "contact",
                label: "Contact section",
                ui: {
                  previewSrc: "/uploads/0123530d-fc16-4cbc-be66-6f1287017394.png",
                  itemProps: (item) => ({ label: item.headline || "Contact section" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Section headline", type: "string", required: true },
                  {
                    name: "email",
                    label: "Contact email",
                    type: "string",
                    ui: { description: "Shown as a clickable email link above the contact form." },
                  },
                ],
              },
              {
                name: "article",
                label: "Article",
                ui: {
                  previewSrc: "/uploads/travel-expands-perspective-without-it-you-.webp",
                  itemProps: (item) => ({ label: item.headline || "Article" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Article headline", type: "string", required: true },
                  { name: "kicker", label: "Small label", type: "string", ui: { description: "Optional. Example: Travel notes." } },
                  { name: "date", label: "Date label", type: "string", ui: { description: "Optional. Plain text, not a date picker." } },
                  { name: "image", label: "Article photo", type: "image" },
                  { name: "imageAlt", label: "Photo description", type: "string", ui: { description: "For screen readers. Example: Cynthia with students in Spain." } },
                  { name: "body", label: "Article text", type: "rich-text", overrides: { toolbar: ["bold", "italic", "link"] } },
                  { name: "ctaLabel", label: "Button text", type: "string", ui: { description: "Leave blank when no button is needed." } },
                  { name: "ctaUrl", label: "Button link", type: "string" },
                ],
              },
              {
                name: "textBanner",
                label: "Text Banner",
                ui: {
                  previewSrc: "/uploads/9f44fbac-b412-4853-8963-ebc6132ed278.webp",
                  itemProps: (item) => ({ label: item.headline || "Text banner" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Banner headline", type: "string", required: true },
                  { name: "body", label: "Banner text", type: "rich-text", overrides: { toolbar: ["bold", "italic", "link"] } },
                  { name: "ctaLabel", label: "Button text", type: "string", ui: { description: "Leave blank when no button is needed." } },
                  { name: "ctaUrl", label: "Button link", type: "string" },
                ],
              },
              {
                name: "logoGrid",
                label: "Logo Grid",
                ui: {
                  previewSrc: "/uploads/0123530d-fc16-4cbc-be66-6f1287017394.png",
                  itemProps: (item) => ({ label: item.headline || "Logo grid" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Section headline", type: "string", required: true },
                  {
                    name: "items",
                    label: "Logos",
                    type: "object",
                    list: true,
                    openFormOnCreate: true,
                    ui: { description: "Add one logo at a time.", itemProps: (item) => ({ label: item.title || "Logo" }) },
                    fields: [
                      { name: "image", label: "Logo image", type: "image" },
                      { name: "title", label: "Logo name", type: "string", required: true },
                      { name: "url", label: "Website link", type: "string", ui: { description: "Optional. Full https:// link." } },
                    ],
                  },
                ],
              },
              {
                name: "newsletter",
                label: "Newsletter",
                ui: {
                  previewSrc: "/uploads/9f44fbac-b412-4853-8963-ebc6132ed278.webp",
                  itemProps: (item) => ({ label: item.headline || "Newsletter" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Section headline", type: "string", required: true },
                  { name: "body", label: "Short invitation", type: "rich-text", overrides: { toolbar: ["bold", "italic"] } },
                  { name: "email", label: "Destination email", type: "string", ui: { description: "Sign-ups open an email to this address. No subscriber list is stored on the site." } },
                  { name: "ctaLabel", label: "Button text", type: "string", ui: { description: "Usually 'Subscribe'." } },
                ],
              },
              {
                name: "team",
                label: "Team",
                ui: {
                  previewSrc: "/uploads/making-memories-one-country-at-a-time-2.webp",
                  itemProps: (item) => ({ label: item.headline || "Team" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Section headline", type: "string", required: true },
                  {
                    name: "items",
                    label: "Team members",
                    type: "object",
                    list: true,
                    openFormOnCreate: true,
                    ui: { description: "Add one person at a time.", itemProps: (item) => ({ label: item.title || "Team member" }) },
                    fields: [
                      { name: "image", label: "Photo", type: "image" },
                      { name: "title", label: "Name", type: "string", required: true },
                      { name: "kicker", label: "Role", type: "string" },
                      { name: "body", label: "Short bio", type: "rich-text", overrides: { toolbar: ["bold", "italic", "link"] } },
                      { name: "url", label: "Profile link", type: "string", ui: { description: "Optional. Full https:// link." } },
                    ],
                  },
                ],
              },
              {
                name: "video",
                label: "Video",
                ui: {
                  previewSrc: "/uploads/making-memories-one-country-at-a-time.webp",
                  itemProps: (item) => ({ label: item.headline || "Video" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Section headline", type: "string", required: true },
                  { name: "videoUrl", label: "YouTube or Vimeo link", type: "string", ui: { description: "Paste the normal video page link. Other sites are ignored." } },
                  { name: "caption", label: "Caption", type: "string", ui: { description: "Optional line under the video." } },
                  { name: "body", label: "Description", type: "rich-text", overrides: { toolbar: ["bold", "italic", "link"] } },
                ],
              },
              {
                name: "codeEmbed",
                label: "Code Embed",
                ui: {
                  previewSrc: "/uploads/9f44fbac-b412-4853-8963-ebc6132ed278.webp",
                  itemProps: (item) => ({ label: item.headline || "Code embed" }),
                },
                fields: [
                  ...colorFields(),
                  ...sizeFields(),
                  { name: "headline", label: "Section headline", type: "string", required: true },
                  {
                    name: "embedUrl",
                    label: "Embed page link",
                    type: "string",
                    ui: { description: "Advanced. HTTPS link from YouTube, Vimeo, Google Docs, Google Calendar, Spotify, or SoundCloud. Raw code is not accepted." },
                  },
                  { name: "embedTitle", label: "Embed title", type: "string", ui: { description: "Short name for screen readers." } },
                  { name: "caption", label: "Caption", type: "string", ui: { description: "Optional line under the embed." } },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "settings",
        label: "Site settings",
        path: "content/global",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: "string", name: "name", label: "Site name" },
          {
            type: "image",
            name: "logo",
            label: "Logo",
            ui: { description: "Used in the header and footer." },
          },
          {
            type: "string",
            name: "tagline",
            label: "About Cynthia",
            ui: { component: "textarea", description: "Long description kept from the original site." },
          },
          {
            type: "object",
            name: "nav",
            label: "Menu links",
            list: true,
            openFormOnCreate: true,
            ui: {
              description: "Order shown in the header. Contact Us appears as a dark button.",
              itemProps: (item) => ({ label: item.label || "Menu link" }),
            },
            fields: [
              { name: "label", label: "Menu text", type: "string" },
              {
                name: "href",
                label: "Link",
                type: "string",
                ui: { description: "Use /#section-id for links on this page." },
              },
            ],
          },
          {
            type: "object",
            name: "social",
            label: "Social profiles",
            list: true,
            openFormOnCreate: true,
            ui: {
              description: "Shown in the mobile menu only.",
              itemProps: (item) => ({ label: item.platform || "Social profile" }),
            },
            fields: [
              { name: "platform", label: "Platform name", type: "string", ui: { description: "Instagram, Facebook, or TikTok." } },
              { name: "url", label: "Profile URL", type: "string" },
            ],
          },
          {
            type: "string",
            name: "footerLink",
            label: "Footer link URL",
          },
          {
            type: "string",
            name: "footerLinkLabel",
            label: "Footer link text",
          },
          {
            type: "object",
            name: "theme",
            label: "Colors and fonts",
            ui: { description: "Kept from the original site. Do not change unless asked." },
            fields: [
              { name: "background", label: "Background", type: "string" },
              { name: "foreground", label: "Text", type: "string" },
              { name: "accent", label: "Accent", type: "string" },
              { name: "displayFont", label: "Display font", type: "string" },
              { name: "bodyFont", label: "Body font", type: "string" },
            ],
          },
          {
            type: "object",
            name: "seo",
            label: "Search results",
            ui: { description: "Title and description shown in Google." },
            fields: [
              { name: "title", label: "Title tag", type: "string", ui: { component: SeoTitleField, description: "Preview updates as you type." } },
              { name: "description", label: "Meta description", type: "string", ui: { component: "textarea", description: "One or two sentences. Keep it under 160 characters." } },
            ],
          },
        ],
      },
      {
        name: "post",
        label: "Talks & writing",
        path: "content/posts",
        format: "md",
        defaultItem: () => ({
          title: `talk-${new Date().toISOString().slice(0, 10)}`,
          date: new Date().toISOString(),
        }),
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Date", ui: { dateFormat: "YYYY-MM-DD" } },
          { type: "string", name: "excerpt", label: "One-line summary", ui: { component: "textarea" } },
          { type: "image", name: "cover", label: "Cover image" },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "boolean", name: "draft", label: "Draft (hidden from the site)" },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },
    ],
  },
});
