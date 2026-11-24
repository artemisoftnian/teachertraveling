// Hand-written so the page component stays readable. `tinacms build` regenerates
// typed versions in tina/__generated__/types.ts if you prefer those.
export const pageQuery = /* GraphQL */ `
  query Page($relativePath: String!) {
    page(relativePath: $relativePath) {
      title
      description
      sections {
        __typename
        ... on PageSectionsHero { type headline eyebrow body image imageAlt ctaLabel ctaUrl }
        ... on PageSectionsProse { type headline body }
        ... on PageSectionsHeading { type headline }
        ... on PageSectionsImage { type headline image imageAlt body }
        ... on PageSectionsGallery { type headline body items { image meta title text url } }
        ... on PageSectionsTopics { type headline body items { title text meta url image } }
        ... on PageSectionsTestimonials { type headline body items { text title meta url } }
        ... on PageSectionsPress { type headline body items { title text meta url } }
        ... on PageSectionsFaq { type headline body items { title text } }
        ... on PageSectionsStats { type headline body items { title text } }
        ... on PageSectionsPricing { type headline body items { title text meta url } }
        ... on PageSectionsMediakit { type headline body items { title text url } }
        ... on PageSectionsQuote { type headline body items { text title } }
        ... on PageSectionsCta { type headline body ctaLabel ctaUrl }
        ... on PageSectionsContact { type headline body ctaLabel items { title text meta } }
        ... on PageSectionsRawHtml { type headline body }
      }
    }
  }
`;

export const settingsQuery = /* GraphQL */ `
  query Settings($relativePath: String!) {
    settings(relativePath: $relativePath) {
      name
      tagline
      nav { label href }
      social { platform url }
      theme { background foreground accent displayFont bodyFont }
      seo { title description }
    }
  }
`;

export const postsQuery = /* GraphQL */ `
  query Posts { posts { totalCount edges { node { title date excerpt cover draft } } } }
`;

export const postQuery = /* GraphQL */ `
  query Post($relativePath: String!) {
    post(relativePath: $relativePath) { title date excerpt cover tags draft body }
  }
`;
