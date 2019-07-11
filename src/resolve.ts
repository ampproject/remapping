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

function makeRelative(relative: string, base: string): string {
  if (!base.startsWith('.')) return relative;
  if (relative.startsWith('.')) return relative;
  return './' + relative;
}

export default function resolve(base: string | undefined, file: string): string {
  base = base || '';
  if (base && !base.endsWith('/')) base += '/';

  if (base && isAbsolute(base)) return new URL(file, base).href;
  if (isAbsolute(file)) return new URL(file).href;

  const joined = base + file;
  if (!parentRegex.exec(joined)) return makeRelative(resolveRelative(joined), base);

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

  return makeRelative(relative, base);
}
