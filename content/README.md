# Where the content lives

| Path | What it is | Edit it |
| --- | --- | --- |
| `content/pages/*.md` | one file per page, sections in frontmatter | /admin → Pages |
| `content/global/settings.json` | site name, nav, social, colours, SEO | /admin → Site settings |
| `content/posts/*.md` | talks and writing, newest first | /admin → Talks & writing |
| `public/uploads/` | images | drag & drop in the editor |

Each entry under `sections:` is one block from the Solo page and `type:` chooses the
layout. Reorder, delete, or add blocks — nothing else changes.

## Undo
Every save is a commit. `git log --oneline content/pages/index.md` then
`git checkout <sha> -- content/pages/index.md`. Solo never gave you history.
