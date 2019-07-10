export default class FastStringArray {
  private map: { [key:string]: number };
  array: string[];

  constructor() {
    this.map = Object.create(null);
    this.array = [];
  }

  put(key: string): number {
    const {array, map} = this;
    // The key may or may not be present. If it is present, it's a number.
    let index = map[key] as number | undefined;

    if (index === undefined) {
      index = array.length;
      map[key] = index;
      array.push(key);
    }
    
    return index;
  }
}
