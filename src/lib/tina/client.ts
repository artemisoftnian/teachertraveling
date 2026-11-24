// `tinacms build` generates this client from tina/config.ts.
import { createClient } from "../../../tina/__generated__/client";
import { pageQuery, settingsQuery, postQuery, postsQuery } from "./queries";

export const client = createClient({
  queries: { pageQuery, settingsQuery, postQuery, postsQuery },
});

export const slugToRelativePath = (slug: string[]) =>
  slug.length ? `${slug.join("-")}.md` : "index.md";
