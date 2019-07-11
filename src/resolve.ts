type GlobalURL = import('url').URL;
interface Url extends GlobalURL {
  // tslint:disable-next-line no-misused-new
  new (input: string, base?: string): Url;
}

// tslint:disable-next-line: no-any
declare var self: any;
const URL: Url = typeof self !== 'undefined' ? self.URL : require('url').URL;

function isAbsolute(url: string): boolean {
  try {
    return !!new URL(url);
  } catch (e) {
    return false;
  }
}

export default function resolve(root: string | undefined, file: string): string {
  if (!root) return file;
  if (!root.endsWith('/')) root += '/';

  if (!isAbsolute(root)) {
    return new URL(file, root).href;
  }

  const { pathname } = new URL(root + file, 'http://foo/');
  return root.startsWith('/') ? pathname : pathname.slice(1);
}
