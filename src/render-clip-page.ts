import { type ClipSource, parseClipRecord } from "./clip-record.ts";

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

function safeHttpUrl(value: string): URL | undefined {
  if (!URL.canParse(value)) return undefined;
  const url = new URL(value);
  return url.protocol === "http:" || url.protocol === "https:" ? url : undefined;
}

function renderSource(source: ClipSource): string {
  const label = escapeHtml(source.title ?? source.uri);
  const url = safeHttpUrl(source.uri);
  const content = url
    ? `<a href="${escapeHtml(url.href)}" rel="noopener noreferrer">${label}</a>`
    : label;
  return `<p class="source">出典: ${content}</p>`;
}

export function renderClipPage(value: unknown, rkey: string): string {
  const record = parseClipRecord(value);
  const quote = record.quote === undefined ? undefined : escapeHtml(record.quote);
  const text = record.text === undefined ? undefined : escapeHtml(record.text);
  const source = record.source === undefined ? "" : renderSource(record.source);
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>clip ${rkey}</title>
</head>
<body>
<article>
${quote ? `<blockquote>${quote}</blockquote>` : ""}
${text ? `<p class="comment">${text}</p>` : ""}
${source}
</article>
</body>
</html>
`;
}
