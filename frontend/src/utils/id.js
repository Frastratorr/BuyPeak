export const createId = (prefix = "id") =>
  `${prefix}-${crypto.randomUUID()}`;