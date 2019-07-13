import { relative as pathRelative, resolve as pathResolve } from 'path';

type WhatWgUrl = import('url').URL;
interface Url extends WhatWgUrl {
  new (input: string, base?: string): WhatWgUrl;
}
declare var URL: unknown;

/* istanbul ignore next */
const Url = (typeof URL !== 'undefined' ? URL : require('url').URL) as Url;

function isAbsoluteUrl(url: string): boolean {
  try {
    return !!new Url(url);
  } catch (e) {
    return false;
  }
}

function withTrailingSlash(str: string): string {
  if (!str.endsWith('/')) str += '/';
  return str;
}

function isProtocolRelativeUrl(url: string): boolean {
  return url.startsWith('//');
}

function isPathAbsolute(path: string): boolean {
  return path.startsWith('/');
}

function resolveProtocolRelative(input: string, base: string): string {
  const { href, protocol } = new Url(input, base);
  return href.slice(protocol.length);
}

/**
 * Attempts to resolve `input` URL relative to `base`.
 */
export function resolve(input: string, base: string | undefined): string {
  base = base || '';

  // Absolute inputs are very easy to resolve right.
  if (isAbsoluteUrl(input)) return new Url(input).href;

  // If it's protocol relative, we need to extract the protocol from the base,
  // if it's absolute.
  if (isProtocolRelativeUrl(input)) {
    if (isAbsoluteUrl(base)) {
      const { protocol } = new Url(base);
      return new Url(protocol + input).href;
    }
    return resolveProtocolRelative(input, 'https://foo.com/');
  }

  if (base) {
    // The base should always end with a leading slash, to avoid errors with
    // `https://foo.com` throwing.
    base = withTrailingSlash(base);

    if (isAbsoluteUrl(base)) return new Url(input, base).href;
    if (isProtocolRelativeUrl(base)) return resolveProtocolRelative(input, `https:${base}`);
  }

  // We now know both input and base are paths.
  const resolved = pathResolve(base, input);

  // If either were an absolute path, then the resolved path will already be an
  // absolute path.
  if (isPathAbsolute(input) || isPathAbsolute(base)) return resolved;

  // Both were relative paths, and Node prepended the CWD, which we don't want.
  const relative = pathRelative('', resolved);

  // If either path started with a dot, let's keep the dot.
  if (!relative.startsWith('.') && (base.startsWith('.') || input.startsWith('.'))) {
    return `./${relative}`;
  }
  return relative;
}
