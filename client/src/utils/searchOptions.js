export const DEFAULT_SEARCH_OPTIONS = { people: 1 };

export function normalizeSearchOptions(options) {
  if (!options || typeof options !== "object") {
    return { ...DEFAULT_SEARCH_OPTIONS };
  }
  if (options.people != null && options.people !== "") {
    return { people: Math.max(1, Number(options.people) || 1) };
  }
  const adults = Number(options.adults) || 0;
  const children = Number(options.children) || 0;
  const total = adults + children;
  return { people: Math.max(1, total || 1) };
}

export function formatPeopleCount(count) {
  const n = Math.max(1, Number(count) || 1);
  return `${n} ${n === 1 ? "person" : "people"}`;
}
