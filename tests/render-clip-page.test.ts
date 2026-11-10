import { test } from "node:test";
import assert from "node:assert/strict";
import { renderClipPage } from "../src/render-clip-page.ts";

const baseRecord = {
  $type: "as.ason.clip.entry",
  createdAt: "2026-11-10T00:00:00.000Z",
};

test("quote and own comment appear as separate elements", () => {
  const html = renderClipPage(
    {
      ...baseRecord,
      quote: "Make the change easy, then make the easy change.",
      text: "この考え方を覚えておきたい",
    },
    "3l3qo2vutsw2b",
  );

  assert.match(
    html,
    /<blockquote[^>]*>\s*Make the change easy, then make the easy change\.\s*<\/blockquote>/,
  );
  assert.match(html, /<p class="comment">\s*この考え方を覚えておきたい\s*<\/p>/);
});

test("quote and comment are rendered as plain text, not markup", () => {
  const html = renderClipPage(
    {
      ...baseRecord,
      quote: `<script>alert("q")</script> & <b>bold</b>`,
      text: `<img src=x onerror="alert('c')">`,
    },
    "3l3qo2vutsw2b",
  );

  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<img/i);
  assert.doesNotMatch(html, /<b>/);
  assert.match(
    html,
    /&lt;script&gt;alert\(&quot;q&quot;\)&lt;\/script&gt; &amp; &lt;b&gt;bold&lt;\/b&gt;/,
  );
  assert.match(html, /&lt;img src=x onerror=&quot;alert\(&#39;c&#39;\)&quot;&gt;/);
});

test("an http(s) source links to the original page with its title", () => {
  const html = renderClipPage(
    {
      ...baseRecord,
      quote: "引用文",
      source: { uri: "https://example.com/post?a=1&b=2", title: "元記事 <1>" },
    },
    "3l3qo2vutsw2b",
  );

  assert.match(
    html,
    /<a href="https:\/\/example\.com\/post\?a=1&amp;b=2" rel="noopener noreferrer">元記事 &lt;1&gt;<\/a>/,
  );
});

test("a source without a title shows its URL as the link text", () => {
  const html = renderClipPage(
    { ...baseRecord, quote: "引用文", source: { uri: "http://example.com/a" } },
    "3l3qo2vutsw2b",
  );

  assert.match(html, /<a href="http:\/\/example\.com\/a" [^>]*>http:\/\/example\.com\/a<\/a>/);
});

test("a record with no text, quote, or image is rejected", () => {
  for (const record of [
    { ...baseRecord },
    { ...baseRecord, text: "", quote: "", images: [] },
    { ...baseRecord, source: { uri: "https://example.com" } },
  ]) {
    assert.throws(() => renderClipPage(record, "3l3qo2vutsw2b"), /text, quote, or image/);
  }
});

test("a record whose fields have the wrong type is rejected", () => {
  for (const record of [
    null,
    "not a record",
    { ...baseRecord, $type: "app.bsky.feed.post", text: "x" },
    { ...baseRecord, quote: 42 },
    { ...baseRecord, text: "x", source: { title: "no uri" } },
    { ...baseRecord, text: "x", source: { uri: "https://example.com", title: 1 } },
  ]) {
    assert.throws(() => renderClipPage(record, "3l3qo2vutsw2b"), TypeError, JSON.stringify(record));
  }
});

test("a non-http(s) source is shown as text, never as a link", () => {
  for (const uri of ["javascript:alert(1)", "JavaScript:alert(1)", "data:text/html,x", "//evil.example"]) {
    const html = renderClipPage(
      { ...baseRecord, quote: "引用文", source: { uri, title: "出典" } },
      "3l3qo2vutsw2b",
    );

    assert.doesNotMatch(html, /<a /, uri);
    assert.match(html, /出典/, uri);
  }
});
