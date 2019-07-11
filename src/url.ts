type GlobalURL = import('url').URL;
interface Url extends GlobalURL {
  // tslint:disable-next-line no-misused-new
  new (input: string): Url;
}

// tslint:disable-next-line: no-any
declare var URL: any;
export default (typeof URL !== 'undefined' ? URL : require('url').URL) as Url;
