import { IComponent } from "../../infra/Ecs";
import { Vec2 } from "../../infra/LinAlg";

export default class CGridCollider implements IComponent {
  // grid pos being in the collider here doesn't make a whole lot of sense
  // should be on the sprite or something
  public gridPos: Vec2 | null = null;
  public nextGridPos: Vec2 | null = null;
}
