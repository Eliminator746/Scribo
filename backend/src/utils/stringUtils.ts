export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove multiple hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start/end
};
