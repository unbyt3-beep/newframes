/**
 * Ensures an image URL is valid for Next.js Image component.
 * - Trims whitespace
 * - Replaces backslashes with forward slashes
 * - Adds leading slash to relative paths
 */
export function fixImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return "/images/placeholder.png";
  
  let fixed = url.trim().replace(/\\/g, '/');
  
  // If it's an absolute URL (http/https), return it
  if (fixed.startsWith('http://') || fixed.startsWith('https://')) {
    return fixed;
  }
  
  // If it's a relative path, ensure it starts with /
  if (!fixed.startsWith('/')) {
    fixed = '/' + fixed;
  }
  
  return fixed;
}
