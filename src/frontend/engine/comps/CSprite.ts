import { IComponent } from "../../infra/Ecs";
import { Vec2 } from "../../infra/LinAlg";
import { MoveDirection } from "../systems/GridMovementSystem";

export type SpriteSheetInfo = {
  readonly numRows: number;
  readonly numCols: number;
  readonly spriteWidth: number;
  readonly spriteHeight: number;
}

export class SpriteSheet {
  readonly imgPath: string;
  readonly numRows: number;
  readonly numCols: number;
  readonly spriteWidth: number;
  readonly spriteHeight: number;
  readonly offset: Vec2;
  public gridPos: Vec2 | null = null;

  public img: HTMLImageElement | null = null;
  private _isLoaded: boolean = false;

  constructor(imgPath: string, info: SpriteSheetInfo, offset: Vec2 = new Vec2(0, 0)) {
    this.numRows = info.numRows;
    this.numCols = info.numCols;
    this.spriteWidth = info.spriteWidth;
    this.spriteHeight = info.spriteHeight;
    this.imgPath = imgPath;
    this.offset = offset;
  }

  public getImgCrop(frame: number): number[] {
    const column = frame % this.numCols;
    const row = Math.floor(frame / this.numRows) % this.numRows;
    return this.getCrop(column + this.offset.y, row + this.offset.x);
  }

  private getCrop(col: number, row: number): number[] {
    return [
      this.spriteWidth * col,
      this.spriteHeight * row,
      this.spriteWidth,
      this.spriteHeight,
    ];
  }

  public loadImage() {
    if (this._isLoaded) return;
    this.img = new Image();
    this.img.src = this.imgPath;
    this.img.onload = () => {
      this._isLoaded = true;
    }
  }
}

export default class CSprite implements IComponent {
  public gridPos = new Vec2();
  public animFrame = 0;
  public activeSheet: SpriteSheet;
  private _direction: MoveDirection;
  public layer: number = 0;

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly description: string,
    public readonly leftSprites: SpriteSheet,
    public readonly rightSprites: SpriteSheet,
    public readonly upSprites: SpriteSheet,
    public readonly downSprites: SpriteSheet,
  ) {
    this.loadImages();
    this.activeSheet = downSprites;
    this._direction = "down";
  }

  public loadImages() {
    this.upSprites.loadImage();
    this.downSprites.loadImage();
    this.leftSprites.loadImage();
    this.rightSprites.loadImage();
  }

  public flipDirection() {
    switch (this._direction) {
      case "left":
        this._direction = "right";
        break;
      case "right":
        this._direction = "left";
        break;
      case "up":
        this._direction = "down";
        break;
      case "down":
        this._direction = "up";
        break;
    }
  }

  public get direction(): MoveDirection {
    return this._direction;
  }

  public set direction(direction: MoveDirection) {
    this._direction = direction;
    switch (direction) {
      case "left":
        this.activeSheet = this.leftSprites;
        break;
      case "right":
        this.activeSheet = this.rightSprites;
        break;
      case "up":
        this.activeSheet = this.upSprites;
        break;
      case "down":
        this.activeSheet = this.downSprites;
        break;
    }
  }

  public getImgCrop() {
    return this.activeSheet.getImgCrop(this.animFrame);
  }

  public getImage() {
    return this.activeSheet.img;
  }
}
