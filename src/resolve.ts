import URL from './url';

function isAbsolute(url: string): boolean {
  try {
    return !!new URL(url);
  } catch (e) {
    return false;
  }
}

export default function resolve(base: string | undefined, file: string): string {
  if (isAbsolute(file)) return new URL(file).href;
  if (base) {
    if (isAbsolute(base)) return new URL(file, base).href;
    throw new Error(`cannot handle relative base "${base}"`);
  }
  return file;
}
