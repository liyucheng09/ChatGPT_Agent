import { IComponent } from "../../infra/Ecs";

export default class CBackgroundTile implements IComponent {

  // TODO use image loader to manager resources
  public img: HTMLImageElement | null = null;
  private isLoaded: boolean = false;

  constructor(
    public readonly imgPath: string = "",
    public readonly width: number = 0,
    public readonly height: number = 0,
  ) {
    this.loadImage();
  }

  public loadImage() {
    this.img = new Image();
    this.img.src = this.imgPath;
    this.img.onload = () => {
      this.isLoaded = true;
    }
  }

  public isImageLoaded() {
    return this.isLoaded;
  }
}