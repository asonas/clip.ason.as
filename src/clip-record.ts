export const CLIP_COLLECTION = "as.ason.clip.entry";

export type ClipSource = {
  uri: string;
  title?: string;
};

export type ClipRecord = {
  text?: string;
  quote?: string;
  source?: ClipSource;
  images: unknown[];
  createdAt: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown, field: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") throw new TypeError(`${field} must be a string`);
  return value;
}

function parseSource(value: unknown): ClipSource | undefined {
  if (value === undefined) return undefined;
  if (!isObject(value)) throw new TypeError("source must be an object");
  const uri = optionalString(value.uri, "source.uri");
  if (uri === undefined) throw new TypeError("source.uri is required");
  const title = optionalString(value.title, "source.title");
  return title === undefined ? { uri } : { uri, title };
}

// Records come from a PDS, so nothing about their shape is trusted.
export function parseClipRecord(value: unknown): ClipRecord {
  if (!isObject(value)) throw new TypeError("record must be an object");
  if (value.$type !== CLIP_COLLECTION) {
    throw new TypeError(`record $type must be ${CLIP_COLLECTION}`);
  }
  const createdAt = optionalString(value.createdAt, "createdAt");
  if (createdAt === undefined) throw new TypeError("createdAt is required");
  if (value.images !== undefined && !Array.isArray(value.images)) {
    throw new TypeError("images must be an array");
  }

  const record: ClipRecord = { images: value.images ?? [], createdAt };
  const text = optionalString(value.text, "text");
  const quote = optionalString(value.quote, "quote");
  const source = parseSource(value.source);
  if (text) record.text = text;
  if (quote) record.quote = quote;
  if (source) record.source = source;

  if (!record.text && !record.quote && record.images.length === 0) {
    throw new Error("A clip needs at least one of text, quote, or image");
  }
  return record;
}
