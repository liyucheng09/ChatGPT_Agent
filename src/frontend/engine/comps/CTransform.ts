import { IComponent } from "../../infra/Ecs";
import { Mat3, Vec2 } from "../../infra/LinAlg";

export default class CTransform implements IComponent {
  public translation = new Vec2();
  public scale = new Vec2(1, 1);
  public rotation: number = 0;

  /**
   * 
   * @returns Matrix corresponding to Translate * R * scale,
   */
  public mat3(): Mat3 {
    const c = Math.cos(this.rotation);
    const s = Math.sin(this.rotation);

    return new Mat3(
      this.scale.x * c, -this.scale.y * s, -this.translation.x,
      this.scale.x * s, this.scale.y * c, -this.translation.y,
      0, 0, 1
    );
  }
}
