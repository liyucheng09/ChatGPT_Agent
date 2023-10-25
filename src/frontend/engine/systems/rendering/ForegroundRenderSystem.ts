import { ISystem } from "../../../infra/Ecs";
import { Vec3 } from "../../../infra/LinAlg";
import CForegroundTile from "../../comps/CForegroundTile";
import CTransform from "../../comps/CTransform";
import GameContext from "../../GameContext";

type ComponentOrder = [CTransform, CForegroundTile];

export default class ForegroundRenderSystem implements ISystem<GameContext, ComponentOrder> {

  public run(gc: GameContext, ents: IterableIterator<[number, ComponentOrder]>): void {

    for (const [, [transform, foreground]] of ents) {
      const pos = gc.viewTransform.mulVec(new Vec3(transform.translation.x, transform.translation.y, 1));
      if (pos.x + foreground.width < 0) continue;
      if (pos.x > gc.canvas.width) continue;
      if (pos.y + foreground.height < 0) continue;
      if (pos.y > gc.canvas.height) continue;

      if (foreground.isImageLoaded()) {
        gc.canvasCtx.drawImage(foreground.img!, pos.x, pos.y);
      }
    }
  }
}