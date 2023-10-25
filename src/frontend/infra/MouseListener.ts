import { Vec2 } from "./LinAlg";

export default class MouseListener {
  private canvas: HTMLCanvasElement;
  private _lastClick: Vec2 | null;
  private _isMouseDown: boolean;
  private _isCtrlDown: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this._lastClick = null;
    this._isMouseDown = false;
    this._isCtrlDown = false;

    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("contextmenu", this.onContextMenu.bind(this));
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  public get lastClick(): Vec2 | null {
    return this._lastClick;
  }

  public get isMouseDown(): boolean {
    return this._isMouseDown;
  }

  public get isCtrlDown(): boolean {
    return this._isCtrlDown;
  }

  public clearLastClick() {
    this._lastClick = null;
  }

  private onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.canvas.focus();
    this._isMouseDown = true;
    this._lastClick = this.getMousePos(event);
  }

  private onMouseUp(event: MouseEvent) {
    event.preventDefault();
    this._isMouseDown = false;
  }

  private onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (this._isMouseDown) {
      this._lastClick = this.getMousePos(event);
    }
  }

  private onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === "Control") {
      this._isCtrlDown = true;
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    if (event.key === "Control") {
      this._isCtrlDown = false;
    }
  }

  private getMousePos(event: MouseEvent): Vec2 {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return new Vec2(
      (event.clientX - rect.left) * scaleX,
      (event.clientY - rect.top) * scaleY
    );
  }
}
