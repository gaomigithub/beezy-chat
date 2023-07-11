export class WebExtensionEvent<TCallback> {
  private _callbacks: Set<TCallback> = new Set();

  public get listeners() {
    return Array.from(this._callbacks);
  }

  public addListener(cb: TCallback): void {
    this._callbacks.add(cb);
  }

  public removeListener(cb: TCallback): void {
    this._callbacks.delete(cb);
  }

  public hasListener(cb: TCallback): boolean {
    return this._callbacks.has(cb);
  }
}
