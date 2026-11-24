import { defineConfig } from "tinacms";

/**
 * Teacher Traveling, rebuilt from the Mozilla Solo export.
 * Each section maps to one visual block from the original page.
 */
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
        label: "Pages",
        path: "content/pages",
        format: "md",
        match: { include: "**/*" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "title", label: "Page title", isTitle: true, required: true },
          { type: "string", name: "description", label: "Short description", ui: { component: "textarea" } },
          {
            name: "sections",
            label: "Sections",
            type: "object",
            list: true,
            templates: [
              {
                name: "intro",
                label: "Hero introduction",
                fields: [
                  { name: "headline", label: "Headline", type: "string" },
                  { name: "body", label: "Body", type: "rich-text" },
                  { name: "image", label: "Background image", type: "image" },
                  { name: "ctaLabel", label: "Button label", type: "string" },
                  { name: "ctaUrl", label: "Button link", type: "string" },
                ],
              },
              {
                name: "services",
                label: "Travel programs",
                fields: [
                  { name: "headline", label: "Headline", type: "string" },
                  {
                    name: "items",
                    label: "Program cards",
                    type: "object",
                    list: true,
                    fields: [
                      { name: "title", label: "Card title", type: "string" },
                      { name: "kicker", label: "Small heading", type: "string" },
                      { name: "body", label: "Body", type: "rich-text" },
                      { name: "image", label: "Image", type: "image" },
                      { name: "ctaLabel", label: "Button label", type: "string" },
                      { name: "ctaUrl", label: "Button link", type: "string" },
                    ],
                  },
                ],
              },
              {
                name: "gallery",
                label: "Photo carousel",
                fields: [
                  { name: "headline", label: "Headline", type: "string" },
                  {
                    name: "items",
                    label: "Photos",
                    type: "object",
                    list: true,
                    fields: [
                      { name: "image", label: "Image", type: "image" },
                      { name: "caption", label: "Caption", type: "string" },
                    ],
                  },
                ],
              },
              {
                name: "quoteBanner",
                label: "Yellow quote banner",
                fields: [
                  { name: "headline", label: "Headline", type: "string" },
                  { name: "body", label: "Body", type: "rich-text" },
                ],
              },
              {
                name: "imageBanner",
                label: "Image banner",
                fields: [{ name: "image", label: "Image", type: "image" }],
              },
              {
                name: "scheduling",
                label: "Blue scheduling banner",
                fields: [
                  { name: "headline", label: "Headline", type: "string" },
                  { name: "body", label: "Body", type: "rich-text" },
                  { name: "ctaLabel", label: "Button label", type: "string" },
                  { name: "ctaUrl", label: "Button link", type: "string" },
                ],
              },
              {
                name: "reviews",
                label: "Traveler reviews",
                fields: [
                  { name: "headline", label: "Headline", type: "string" },
                  {
                    name: "items",
                    label: "Reviews",
                    type: "object",
                    list: true,
                    fields: [
                      { name: "body", label: "Review", type: "rich-text" },
                      { name: "author", label: "Author", type: "string" },
                    ],
                  },
                ],
              },
              {
                name: "faq",
                label: "FAQ accordion",
                fields: [
                  { name: "headline", label: "Headline", type: "string" },
                  {
                    name: "items",
                    label: "Questions",
                    type: "object",
                    list: true,
                    fields: [
                      { name: "title", label: "Question", type: "string" },
                      { name: "text", label: "Answer", type: "rich-text" },
                    ],
                  },
                ],
              },
              {
                name: "contact",
                label: "Contact section",
                fields: [
                  { name: "headline", label: "Headline", type: "string" },
                  { name: "email", label: "Email address", type: "string" },
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
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "name", label: "Site name" },
          { type: "image", name: "logo", label: "Logo" },
          { type: "string", name: "tagline", label: "Tagline", ui: { component: "textarea" } },
          {
            type: "object",
            name: "nav",
            label: "Navigation",
            list: true,
            fields: [
              { name: "label", label: "Label", type: "string" },
              { name: "href", label: "Link", type: "string" },
            ],
          },
          {
            type: "object",
            name: "social",
            label: "Social profiles",
            list: true,
            fields: [
              { name: "platform", label: "Platform", type: "string" },
              { name: "url", label: "Profile URL", type: "string" },
            ],
          },
          { type: "string", name: "footerLink", label: "Footer link URL" },
          { type: "string", name: "footerLinkLabel", label: "Footer link label" },
          {
            type: "object",
            name: "theme",
            label: "Colours kept from the export",
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
            label: "SEO",
            fields: [
              { name: "title", label: "Title tag", type: "string" },
              { name: "description", label: "Meta description", type: "string" },
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
