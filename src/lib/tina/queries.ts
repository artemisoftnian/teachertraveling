// Hand-written so the page component and Tina's live editor use the same document.
// Types and fields must match tina/__generated__/schema.gql.
export const pageWithSettingsQuery = /* GraphQL */ `
  query PageWithSettings($relativePath: String!, $settingsRelativePath: String!) {
    page(relativePath: $relativePath) {
      title
      description
      sections {
        __typename
        ... on PageSectionsImage { image imageAlt }
        ... on PageSectionsProse { headline body ctaLabel ctaUrl }
        ... on PageSectionsGallery {
          headline
          body
          items { image meta }
          image
          imageAlt
          ctaLabel
          ctaUrl
        }
        ... on PageSectionsCta { headline ctaLabel ctaUrl }
        ... on PageSectionsTopics { headline body items { text } }
        ... on PageSectionsFaq { headline items { title text } }
      }
    }
    settings(relativePath: $settingsRelativePath) {
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
