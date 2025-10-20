// src/global.d.ts

// global.d.ts
declare module 'jsvectormap' {
  export default class JsVectorMap {
    constructor(options: any);
    setFocus(params: any): void;
    updateSize(): void;
    destroy(): void;
    getSelected?(): any;
  }
}

declare module 'jsvectormap/dist/jsvectormap.css';
