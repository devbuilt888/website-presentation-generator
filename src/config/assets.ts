export function getAssetUrl(path: string): string {
  if (!path) return path;
  // If it's already an absolute URL, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  // If configured, prefix with public base (e.g., Supabase Storage public URL)
  const base = process.env.NEXT_PUBLIC_ASSET_BASE?.replace(/\/$/, '');
  if (base) {
    // Strip leading slash to avoid double slash
    const clean = path.replace(/^\//, '');
    return `${base}/${clean}`;
  }
  return path;
}
