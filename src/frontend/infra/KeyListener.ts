export default class KeyListener {
  private keyPressTimes: { [key: string]: number } = {};

  constructor(element: HTMLElement) {
    element.addEventListener('keydown', this.handleKeyDown);
    element.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.keyPressTimes[event.key] = Date.now();
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    delete this.keyPressTimes[event.key];
  };

  isKeyDown(key: string): boolean {
    return (this.keyPressTimes[key] ?? 0) > 0;
  }

  getKeyPressTime(key: string): number | null {
    if (key in this.keyPressTimes) {
      return this.keyPressTimes[key];
    } else {
      return null;
    }
  }

  isAnyKeyDown(keys: string[]): boolean {
    return keys.some(key => this.isKeyDown(key));
  }

  /**
   * 
   * @param keys Optional. If not provided, all keys are checked
   * @returns The last key that was pressed
   */
  getLastKeyDown(...keys: string[]): string | null {
    let lastKeyDown: string | null = null;
    let lastKeyPressTime = Number.NEGATIVE_INFINITY;

    if ((keys?.length ?? 0) > 0) {
      keys.forEach(key => {
        const keyPressTime = this.getKeyPressTime(key);
        if (keyPressTime !== null && keyPressTime > lastKeyPressTime) {
          lastKeyDown = key;
          lastKeyPressTime = keyPressTime;
        }
      });

      return lastKeyDown;
    }

    for (const [key, keyPressTime] of Object.entries(this.keyPressTimes)) {
      if (keyPressTime !== null && keyPressTime > lastKeyPressTime) {
        lastKeyDown = key;
        lastKeyPressTime = keyPressTime;
      }
    }
    return lastKeyDown;
  }
}
