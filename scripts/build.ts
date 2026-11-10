import { readFile, rm } from "node:fs/promises";
import { buildSite, type FetchedClip } from "../src/build-site.ts";

// Fetching from the PDS is not wired up yet; the build reads sample
// records shaped like what a PDS returns.
const SOURCE = new URL("../fixtures/sample-clips.json", import.meta.url);
const OUT_DIR = new URL("../dist/site/", import.meta.url);

const clips = JSON.parse(await readFile(SOURCE, "utf8")) as FetchedClip[];
await rm(OUT_DIR, { recursive: true, force: true });
await buildSite(clips, OUT_DIR.pathname);
console.log(`Built ${clips.length} clip page(s) into ${OUT_DIR.pathname}`);
