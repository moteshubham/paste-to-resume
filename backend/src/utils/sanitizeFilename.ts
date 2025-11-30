export const sanitize = (text: string): string => {
  if (!text) return "";

  return text
    .trim()
    .replace(/\s+/g, "_")           // spaces → underscores
    .replace(/[^a-zA-Z0-9_]/g, "")  // remove invalid chars
    .slice(0, 40);                   // limit length
};

