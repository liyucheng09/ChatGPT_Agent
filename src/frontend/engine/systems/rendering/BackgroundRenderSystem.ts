import { ISystem } from "../../../infra/Ecs";
import { Vec3 } from "../../../infra/LinAlg";
import CBackgroundTile from "../../comps/CBackgroundTile";
import CTransform from "../../comps/CTransform";
import GameContext from "../../GameContext";

type ComponentOrder = [CTransform, CBackgroundTile];

export default class BackgroundRenderSystem implements ISystem<GameContext, ComponentOrder> {

  public run(gc: GameContext, ents: IterableIterator<[number, ComponentOrder]>): void {

    for (const [, [transform, background]] of ents) {
      const pos = gc.viewTransform.mulVec(new Vec3(transform.translation.x, transform.translation.y, 1));
      if (pos.x + background.width < 0) continue;
      if (pos.x > gc.canvas.width) continue;
      if (pos.y + background.height < 0) continue;
      if (pos.y > gc.canvas.height) continue;

      if (background.isImageLoaded()) {
        gc.canvasCtx.drawImage(background.img!, pos.x, pos.y);
      }
    }
  }
}