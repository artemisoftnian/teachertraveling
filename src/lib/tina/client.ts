// If src/lib/tina/client.ts simply creates and exports the client, replace its contents with:
import { client } from "../../../tina/__generated__/client";
import { postQuery, postsQuery } from "./queries";


export { client };
export default client;

export function slugToRelativePath(slug?: string[]): string {
  if (!slug || slug.length === 0) {
    return "index.md"; // <-- Match the exact filename inside content/pages/
  }
  return `${slug.join("/")}.md`;
}