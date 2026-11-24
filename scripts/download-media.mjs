import { mkdir, readFile, writeFile } from "node:fs/promises";

/**
 * Solo's ZIP only holds links, so this fetches every image once,
 * largest variant first, and records what it could not reach.
 *   node scripts/download-media.mjs     (alias: npm run media)
 */
const dir = new URL("../", import.meta.url);

async function main() {
  const manifest = JSON.parse(await readFile(new URL("public/uploads/media-manifest.json", dir), "utf8"));
  await mkdir(new URL("public/uploads/", dir), { recursive: true });
  let saved = 0;
  const missing = [];

  for (const item of manifest.items) {
    const out = new URL(item.file.replace(/^public\//, ""), dir);
    for (const url of [item.from, item.original].filter(Boolean)) {
      try {
        const res = await fetch(url, { headers: { "user-agent": "solo-lifeline/1.0" } });
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.byteLength < 512) continue;
        await writeFile(out, buf);
        saved += 1;
        console.log("saved", item.file, `(${Math.round(buf.byteLength / 1024)} KB)`);
        break;
      } catch(err) {
        console.log(err, item.original,"cant download it")
      }
    }
    if (!missing.includes(item.file)) missing.push(item.file);
  }
  const failed = manifest.items.length - saved;
  console.log(`\n${saved}/${manifest.items.length} images in public/uploads`);
  if (failed > 0) console.warn(`${failed} need saving by hand from the live Solo page`);
}

main();
