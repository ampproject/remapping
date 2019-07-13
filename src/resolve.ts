type WhatWgUrl = import('url').URL;
interface Url extends WhatWgUrl {
  new (input: string, base?: string): WhatWgUrl;
}
declare var URL: unknown;

/* istanbul ignore next */
const Url = (typeof URL !== 'undefined' ? URL : require('url').URL) as Url;

// Matches "..", which must be preceeded by "/" or the start of the string, and
// must be followed by a "/".
const parentRegex = /(^|\/)\.\.(?:\/)/g;

function isAbsoluteUrl(url: string): boolean {
  try {
    return !!new Url(url);
  } catch (e) {
    return false;
  }
}

function isProtocolRelativeUrl(url: string): boolean {
  return url.startsWith('//');
}

function isPathAbsolute(path: string): boolean {
  return path.startsWith('/');
}

/**
 * Creates a directory name that is guaranteed to not be in `str`.
 */
function uniqInStr(str: string): string {
  let uniq = String(Math.random()).slice(2);
  while (str.indexOf(uniq) > -1) {
    /* istanbul ignore next */
    uniq += uniq;
  }
  return `z${uniq}/`;
}

/**
 * Resolves a protocol relative URL, but keeps it protocol relative.
 * Essentially just for the normalization.
 */
function resolveProtocolRelative(input: string, absoluteBase: string): string {
  const { href, protocol } = new Url(input, absoluteBase);
  return href.slice(protocol.length);
}

/**
 * Resolves a relative URL, while keeping it relative.
 * Essentially just for the normalization.
 */
function resolveToAfterOrigin(input: string): string {
  const { href } = new Url(input, 'https://foo.com/');
  return href.slice('https://foo.com/'.length);
}

function resolvePath(input: string, base: string): string {
  const joined = isPathAbsolute(input) ? input : base + input;
  if (!parentRegex.test(joined)) {
    return resolveToAfterOrigin(joined);
  }

  const uniq = uniqInStr(joined);
  let prefix = '';
  let total = 0;
  do {
    prefix += uniq;
    total++;
  } while (parentRegex.test(joined));

  if (joined.startsWith('/')) prefix = prefix.slice(0, -1);
  let relative = resolveToAfterOrigin(prefix + joined);

  const search = new RegExp(`^(${uniq})*`, 'g');
  relative = relative.replace(search, (all: string) => {
    const leftover = all.length / uniq.length;
    return '../'.repeat(total - leftover);
  });

  return relative;
}

/**
 * Attempts to resolve `input` URL relative to `base`.
 */
export function resolve(input: string, base: string | undefined): string {
  base = base || '';

  // Absolute inputs are very easy to resolve right.
  if (isAbsoluteUrl(input)) return new Url(input).href;

  if (base) {
    // Bases are always implied to contain a directory path, Chrome and
    // Mozilla's implementations.
    if (!base.endsWith('/')) base += '/';

    // Absolute paths are easy...
    if (isAbsoluteUrl(base)) return new Url(input, base).href;

    // If it's protocl relative, we'll normalize it but keep it protocol
    // relative.
    if (isProtocolRelativeUrl(base)) return resolveProtocolRelative(input, `https:${base}`);
  }

  if (isProtocolRelativeUrl(input)) {
    // If input is protocol relative, we just need to extract the protocol from
    // the base if it's absolute.
    if (isAbsoluteUrl(base)) return new Url(input, base).href;

    // Else, we'll normalize it but keep it protocol relative.
    return resolveProtocolRelative(input, 'https://foo.com/');
  }

  // We now know both input and base are paths.
  const resolved = resolvePath(input, base);

  // If either was an absolute path, our path resolver will have stripped the
  // leading slash. Resolving it again is easy enough, plus it'll strip out any
  // leading ".." that could have accumlated if input has more parent accessors
  // than base had depth.
  if (isPathAbsolute(input) || isPathAbsolute(base)) {
    return '/' + resolveToAfterOrigin(resolved);
  }

  // If either path started with a dot, let's keep the dot.
  if (!resolved.startsWith('.') && (base.startsWith('.') || (!base && input.startsWith('.')))) {
    return `./${resolved}`;
  }
  return resolved;
}
