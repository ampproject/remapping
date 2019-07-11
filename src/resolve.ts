import URL from './url';

const parentRegex = /(^|\/)\.{2}(?:\/)/g;

function isAbsolute(url: string): boolean {
  try {
    return !!new URL(url);
  } catch (e) {
    return false;
  }
}

function uniqInStr(str: string): string {
  let uniq = String(Math.random()).slice(2);
  while (str.indexOf(uniq) > -1) {
    uniq += uniq;
  }
  return `z${uniq}/`;
}

function resolveRelative(relative: string): string {
  const { href } = new URL(`https://foo/${relative}`);

  // Scheme relative URLs
  if (relative.startsWith('//')) return href.slice('http:'.length);

  // Absolute path URLs
  if (relative.startsWith('/')) return href.slice('http://foo'.length);

  // Path relative URLs
  return href.slice('https://foo/'.length);
}

function makeRelative(relative: string, root: string): string {
  if (!root.startsWith('.')) return relative;
  if (relative.startsWith('.')) return relative;
  return './' + relative;
}

export default function resolve(root: string | undefined, file: string): string {
  root = root || '';
  if (root && !root.endsWith('/')) root += '/';

  const joined = root + file;
  if (isAbsolute(joined)) return new URL(joined).href;

  if (!parentRegex.exec(joined)) return makeRelative(resolveRelative(joined), root);

  let prefix = '';
  const uniq = uniqInStr(joined);
  do {
    prefix += uniq;
  } while (parentRegex.exec(joined));

  let relative = resolveRelative(prefix + joined);

  const search = new RegExp(`^(${uniq})+`, 'g');
  relative = relative.replace(search, (all: string, uniq: string) => {
    const { length } = uniq;
    const total = prefix.length / length;
    const leftover = uniq.length / length;

    return '../'.repeat(total - leftover);
  });

  return makeRelative(relative, root);
}
