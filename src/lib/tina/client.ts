// If src/lib/tina/client.ts simply creates and exports the client, replace its contents with:
import { client } from "../../../tina/__generated__/client";
import { pageQuery, settingsQuery, postQuery, postsQuery } from "./queries";


export { client };
export default client;

export const slugToRelativePath = (slug: string[]) =>
  slug.length ? `${slug.join("-")}.md` : "index.md";
