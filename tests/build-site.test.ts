import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSite } from "../src/build-site.ts";

async function withOutDir(run: (outDir: string) => Promise<void>): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), "clip-build-"));
  try {
    await run(join(root, "site"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

const record = (quote: string) => ({
  $type: "as.ason.clip.entry",
  createdAt: "2026-11-10T00:00:00.000Z",
  quote,
});

test("each clip is written to its fixed URL /clips/<rkey>/", async () => {
  await withOutDir(async (outDir) => {
    await buildSite(
      [
        { rkey: "3l3qo2vutsw2b", value: record("一件目") },
        { rkey: "3l3qo2vuxyz2c", value: record("二件目") },
      ],
      outDir,
    );

    const first = await readFile(join(outDir, "clips/3l3qo2vutsw2b/index.html"), "utf8");
    const second = await readFile(join(outDir, "clips/3l3qo2vuxyz2c/index.html"), "utf8");
    assert.match(first, /<blockquote>一件目<\/blockquote>/);
    assert.match(second, /<blockquote>二件目<\/blockquote>/);
  });
});

test("an rkey that is not a valid record key is rejected before anything is written", async () => {
  for (const rkey of ["..", ".", "../escape", "a/b", "", "a b"]) {
    await withOutDir(async (outDir) => {
      await assert.rejects(
        buildSite([{ rkey: "3l3qo2vutsw2b", value: record("ok") }, { rkey, value: record("x") }], outDir),
        /rkey/,
        JSON.stringify(rkey),
      );
      await assert.rejects(readdir(outDir), { code: "ENOENT" });
    });
  }
});

test("one invalid record fails the build and names its rkey", async () => {
  await withOutDir(async (outDir) => {
    await assert.rejects(
      buildSite(
        [
          { rkey: "3l3qo2vutsw2b", value: record("ok") },
          { rkey: "3l3qo2vbroken", value: { $type: "as.ason.clip.entry", createdAt: "2026-11-10T00:00:00.000Z" } },
        ],
        outDir,
      ),
      /3l3qo2vbroken/,
    );
    await assert.rejects(readdir(outDir), { code: "ENOENT" });
  });
});
