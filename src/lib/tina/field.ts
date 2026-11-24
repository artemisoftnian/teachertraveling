export function tinaField<T extends Record<string, unknown> | null | undefined>(
  object: T,
  property?: keyof Omit<NonNullable<T>, "__typename" | "_sys">,
  index?: number
): string {
  const source = (object as { _content_source?: { queryId?: string; path?: string[] } } | null)
    ?._content_source;

  if (!source?.queryId) {
    return "";
  }

  const path = Array.isArray(source.path) ? [...source.path] : [];
  if (property !== undefined) {
    path.push(String(property));
  }
  if (typeof index === "number") {
    path.push(String(index));
  }

  return `${source.queryId}---${path.join(".")}`;
}
