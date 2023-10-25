import BoundedBox from "../../infra/BoundedBox";
import EcsManager, { EntsWith } from "../../infra/Ecs";
import { Vec2 } from "../../infra/LinAlg";
import CClickable from "../comps/CClickable";
import CSprite from "../comps/CSprite";
import CTransform from "../comps/CTransform";
import GameContext from "../GameContext";

type CompOrder = [CSprite, CClickable, CTransform];
const constructors = [CSprite, CClickable, CTransform];

export default class MousePickerSystem {

  public run(gc: GameContext, ecs: EcsManager): void {

    const invViewTranslation = new Vec2(-1 * gc.viewTransform.m13, -1 * gc.viewTransform.m23);
    const clickWorldSpace = gc.mouse.lastClick?.add(invViewTranslation);
    gc.mouse.clearLastClick();

    const ents: EntsWith<CompOrder> = ecs.getEntsWith(...constructors);

    if (!clickWorldSpace) return;

    // get clickable sprites
    for (const [eid, [sprite, clickable, transform]] of ents) {
      const bb = BoundedBox.forSpriteTransform(sprite, transform);
      if (bb.contains(clickWorldSpace.x, clickWorldSpace.y)) {
        clickable.isSelected = true;
        console.log(eid, ecs.debugEnt(eid));
      } else {
        clickable.isSelected = false;
      }
    }
  }
}