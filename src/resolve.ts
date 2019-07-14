type WhatWgUrl = import('url').URL;
interface Url extends WhatWgUrl {
  new (input: string, base?: string): WhatWgUrl;
}
declare var URL: unknown;

/* istanbul ignore next */
const Url = (typeof URL !== 'undefined' ? URL : require('url').URL) as Url;

// Matches "..", which must be preceeded by "/" or the start of the string, and
// must be followed by a "/". We do not eat the following "/", so that the next
// iteration can match on it.
const parentRegex = /(^|\/)\.\.(?=\/)/g;

function isAbsoluteUrl(url: string): boolean {
  try {
    return !!new Url(url);
  } catch (e) {
    return false;
  }
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
  return uniq;
}

/**
 * Normalizes a protocol relative URL, but keeps it protocol relative by
 * stripping out the protocl before returning it.
 */
function normalizeProtocolRelative(input: string, absoluteBase: string): string {
  const { href, protocol } = new Url(input, absoluteBase);
  return href.slice(protocol.length);
}

/**
 * Normalizes a simple path (one that has no ".."s, or is absolute so ".."s can
 * be normalized absolutely).
 */
function normalizeSimplePath(input: string): string {
  const { href } = new Url(input, 'https://foo.com/');
  return href.slice('https://foo.com/'.length);
}

/**
 * Normalizes a path, ensuring that excess ".."s are preserved for relative
 * paths in the output.
 *
 * If the input is absolute, this will return an absolutey normalized path, but
 * it will not have a leading "/".
 *
 * If the input has a leading "..", the output will have a leading "..".
 *
 * If the input has a leading ".", the output will not have a leading "."
 * unless there are too many ".."s, in which case there will be a leading "..".
 */
function normalizePath(input: string): string {
  // If there are no ".."s, we can treat this as if it were an absolute path.
  // The return won't be an absolute path, so it's easy.
  if (!parentRegex.test(input)) return normalizeSimplePath(input);

  // We already found one "..". Let's see how many there are.
  let total = 1;
  while (parentRegex.test(input)) total++;

  // If there are ".."s, we need to prefix the the path with the same number of
  // unique directories. This is to ensure that we "remember" how many parent
  // directories we are accessing. Eg, "../../.." must keep 3, and "foo/../.."
  // must keep 1.
  const uniqDirectory = `z${uniqInStr(input)}/`;

  // uniqDirectory is just a "z", followed by numbers, followed by a "/". So
  // generating a runtime regex from it is safe. We'll use this search regex to
  // strip out our uniq directory names and insert any needed ".."s.
  const search = new RegExp(`^(?:${uniqDirectory})*`);

  // Now we can resolve the total path. If there are excess ".."s, they will
  // eliminate one or more of the unique directories we prefix with.
  const relative = normalizeSimplePath(uniqDirectory.repeat(total) + input);

  // We can now count the number of unique directories that were eliminated. If
  // there were 3, and 1 was eliminated, we know we only need to add 1 "..". If
  // 2 were eliminated, we need to insert 2 ".."s. If all 3 were eliminated,
  // then we need 3, etc. This replace is guranteed to match (it may match 0 or
  // more times), and we can count the total match to see how many were eliminated.
  return relative.replace(search, (all: string) => {
    const leftover = all.length / uniqDirectory.length;
    return '../'.repeat(total - leftover);
  });
}

/**
 * Attempts to resolve `input` URL relative to `base`.
 */
export function resolve(input: string, base: string | undefined): string {
  if (!base) {
    base = '';
  } else if (!base.endsWith('/')) {
    // Bases are always implied to contain a directory path, per Chrome and
    // Mozilla's implementations.
    base += '/';
  }

  // Absolute URLs are very easy to resolve right.
  if (isAbsoluteUrl(input)) return new Url(input).href;

  if (base) {
    // Absolute URLs are easy...
    if (isAbsoluteUrl(base)) return new Url(input, base).href;

    // If base is protocol relative, we'll resolve with it but keep the result
    // protocol relative.
    if (base.startsWith('//')) return normalizeProtocolRelative(input, `https:${base}`);
  }

  // Normalize input, but keep it protocol relative. We know base doesn't supply
  // a protocol, because that would have been handled above.
  if (input.startsWith('//')) return normalizeProtocolRelative(input, 'https://foo.com/');

  // Absolute paths don't need any special handling, because they cannot have
  // extra "." or ".."s. That'll all be stripped away. Input takes priority here,
  // because if input is an absolute path, base's path won't affect it in any way.
  if (input.startsWith('/')) return '/' + normalizeSimplePath(input);

  // We know that base ends with a "/", and input does not start with one, so
  // it's safe to join.
  const joined = base + input;

  // If base is an absolute path, then input will be relative to it.
  if (base.startsWith('/')) return '/' + normalizeSimplePath(joined);

  // We now know both input and base are relative paths.
  const relative = normalizePath(joined);

  // If base started with a leading ".", or there is no base and input started
  // with a ".", then we need to ensure that the relative path starts with a
  // ".". We don't know if relative starts with a "..", though, so check before
  // prepending.
  if (joined.startsWith('.') && !relative.startsWith('.')) {
    return './' + relative;
  }

  return relative;
}
