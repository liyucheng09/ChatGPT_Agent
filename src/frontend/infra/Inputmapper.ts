import KeyListener from './KeyListener';

export type Action = 'up' | 'down' | 'left' | 'right' | 'interact' | 'cancel' | 'run';

export type KeyMap = {
  [action in Action]: string[];
};

export default class InputMapper {
  private keyListener: KeyListener;
  private keyMap: KeyMap;

  constructor(keyMap: KeyMap, element: HTMLElement) {
    this.keyListener = new KeyListener(element);
    this.keyMap = keyMap;
  }

  isActionDown(action: Action): boolean {
    const keys = this.keyMap[action];
    return this.keyListener.isAnyKeyDown(keys);
  }

  /**
   * 
   * @param action The action to check
   * @returns The time the action was first pressed
   */
  getActionPressTime(action: Action): number | null {
    const keys = this.keyMap[action];
    let minPressTime = this.keyListener.getKeyPressTime(keys[0]);
    for (let i = 1; i < keys.length; i++) {
      const keyPressTime = this.keyListener.getKeyPressTime(keys[i]);
      if (!keyPressTime) continue;
      if (!minPressTime) {
        minPressTime = keyPressTime;
      } else {
        minPressTime = Math.min(minPressTime, keyPressTime);
      }
    }
    return minPressTime;
  }

  getLastActionDown(...actions: Action[]): Action | null {
    const actionsToCheck = ((actions?.length ?? 0) === 0 ? Object.keys(this.keyMap) : actions) as Action[];

    let lastActionDown: string | null = null;
    let lastActionPressTime = Number.NEGATIVE_INFINITY;

    actionsToCheck.forEach(a => {
      const actionPressTime = this.getActionPressTime(a);
      if (actionPressTime !== null && actionPressTime > lastActionPressTime) {
        lastActionDown = a;
        lastActionPressTime = actionPressTime;
      }
    });

    return lastActionDown;
  }
}
