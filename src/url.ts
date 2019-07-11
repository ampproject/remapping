type WhatWgUrl = import('url').URL;
interface Url extends WhatWgUrl {
  new (input: string, base?: string): WhatWgUrl;
}
declare var URL: unknown;

/* istanbul ignore next */ 
export default (typeof URL !== 'undefined' ? URL : require('url').URL) as Url;
