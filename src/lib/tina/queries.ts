// Hand-written so the page component and Tina's live editor use the same document.
// Types and fields must match tina/__generated__/schema.gql.
export const pageWithSettingsQuery = /* GraphQL */ `
  query PageWithSettings($relativePath: String!, $settingsRelativePath: String!) {
    page(relativePath: $relativePath) {
      title
      description
      sections {
        __typename
        ... on PageSectionsIntro {
          headline
          body
          image
          ctaLabel
          ctaUrl
        }
        ... on PageSectionsServices {
          headline
          items {
            title
            kicker
            body
            image
            ctaLabel
            ctaUrl
          }
        }
        ... on PageSectionsGallery {
          headline
          items {
            image
            caption
          }
        }
        ... on PageSectionsQuoteBanner {
          headline
          body
        }
        ... on PageSectionsImageBanner {
          image
        }
        ... on PageSectionsScheduling {
          headline
          body
          ctaLabel
          ctaUrl
        }
        ... on PageSectionsReviews {
          headline
          items {
            body
            author
          }
        }
        ... on PageSectionsFaq {
          headline
          items {
            title
            text
          }
        }
        ... on PageSectionsContact {
          headline
          email
        }
      }
    }
    settings(relativePath: $settingsRelativePath) {
      name
      logo
      tagline
      nav { label href }
      social { platform url }
      footerLink
      footerLinkLabel
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
