/**
 * Trims the filename from a path.
 */
export default function dirname(path: string | undefined): string {
  if (!path) return '';

  // If the path ends with a slash, it's not considered an empty filename.
  // We have to start the search for the last slash before it.
  let index = path.length - 1;
  if (path.endsWith('/')) index--;
  const lastSlash = path.lastIndexOf('/', index);

  // If the path starts with a slash, we have to make sure it's not trimmed.
  if (path.startsWith('/') && lastSlash <= 1) {
    return path.slice(0, lastSlash + 1);
  }

  if (lastSlash >= 0) return path.slice(0, lastSlash);
  return '';
}