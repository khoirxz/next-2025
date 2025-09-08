export const qk = {
  me: ["me"] as const,
  itemTypes: (q?: string, page = 1, limit = 10) =>
    ["item-types", { q, page, limit }] as const,
  rooms: (q?: string, page = 1, limit = 10) =>
    ["rooms", { q, page, limit }] as const,
  items: (params: Record<string, unknown>) => ["items", params] as const,
  item: (id: string) => ["item", id] as const,
  inTxns: (q?: string, page = 1, limit = 10) =>
    ["in-transactions", { q, page, limit }] as const,
};
