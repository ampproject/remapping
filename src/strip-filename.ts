/**
 * Removes the filename from a path.
 */
export default function stripFilename(path: string | undefined): string {
  if (!path) return '';
  const index = path.lastIndexOf('/');
  return path.slice(0, index + 1);
}
