import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { renderClipPage } from "./render-clip-page.ts";

export type FetchedClip = {
  rkey: string;
  value: unknown;
};

// AT Protocol record key syntax. It also keeps the key safe as a path segment.
const RECORD_KEY = /^[A-Za-z0-9._:~-]{1,512}$/;

function assertRecordKey(rkey: string): void {
  if (!RECORD_KEY.test(rkey) || rkey === "." || rkey === "..") {
    throw new Error(`Invalid rkey: ${JSON.stringify(rkey)}`);
  }
}

// Every page is rendered before any file is written, so a bad record
// never leaves a partially built site behind.
export async function buildSite(clips: FetchedClip[], outDir: string): Promise<void> {
  const pages = clips.map(({ rkey, value }) => {
    assertRecordKey(rkey);
    try {
      return { rkey, html: renderClipPage(value, rkey) };
    } catch (error) {
      throw new Error(`Cannot render clip ${rkey}`, { cause: error });
    }
  });

  for (const { rkey, html } of pages) {
    const dir = join(outDir, "clips", rkey);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), html);
  }
}
