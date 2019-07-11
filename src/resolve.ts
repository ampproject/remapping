import URL from './url';

function isAbsolute(url: string): boolean {
  try {
    return !!new URL(url);
  } catch (e) {
    return false;
  }
}

export default function resolve(input: string, base: string | undefined): string {
  if (isAbsolute(input)) return new URL(input).href;
  if (base) {
    base = base.replace(/\/?$/, '/');
    if (isAbsolute(base)) return new URL(input, base).href;
    throw new Error(`cannot handle relative base "${base}"`);
  }
  return input;
}