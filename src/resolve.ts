type WhatWgUrl = import('url').URL;
interface Url extends WhatWgUrl {
  new (input: string, base?: string): WhatWgUrl;
}
declare var URL: unknown;

/* istanbul ignore next */
const Url = (typeof URL !== 'undefined' ? URL : require('url').URL) as Url;

function isAbsolute(url: string): boolean {
  try {
    return !!new Url(url);
  } catch (e) {
    return false;
  }
}

/**
 * Trims the filename from a path.
 */
export function dirname(path: string | undefined): string {
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

  // This should technically return '.', but we have a rough time with relative
  // base directories.
  return '';
}

/**
 * Attempts to resolve `input` URL relative to `base`.
 *
 * In practive, this is very difficult, and probably belongs in its own
 * library. For now, any non-absolute `base` is unsupported, unless the `input`
 * itself is absolute. And normalization doesn't happen on the `input` unless
 * there's an absolute `base`.
 */
export function resolve(input: string, base: string | undefined): string {
  if (isAbsolute(input)) return new Url(input).href;
  if (base) {
    // The base should always end with a leading slash, to avoid errors with
    // `https://foo.com` throwing.
    if (!base.endsWith('/')) base += '/';

    if (isAbsolute(base)) return new Url(input, base).href;
    throw new Error(`cannot handle relative base "${base}"`);
  }
  return input;
}
