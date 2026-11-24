import React from "react";
import { defineConfig } from "tinacms";

/**
 * Teacher Traveling, rebuilt from the Mozilla Solo export.
 * Each section maps to one visual block from the original page.
 * Editor labels and helper text are tuned for non-technical maintenance.
 * Schema synchronized with the homepage content.
 */
function EditorGuide() {
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
      "Click text, photos, or buttons on the page to jump to that field. You can also open ",
      React.createElement("strong", null, "Page sections"),
      " in the sidebar. Drag the handle to reorder sections. Save sends the change to GitHub."
    ),
    React.createElement(
      "p",
      { style: { margin: "8px 0 0", lineHeight: "1.5" } },
      "Do not change the Colors and fonts settings unless asked."
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
                  { name: "headline", label: "Section headline", type: "string", required: true },
                  {
                    name: "email",
                    label: "Contact email",
                    type: "string",
                    ui: { description: "Shown as a clickable email link above the contact form." },
                  },
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
              { name: "title", label: "Title tag", type: "string" },
              { name: "description", label: "Meta description", type: "string", ui: { component: "textarea" } },
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
