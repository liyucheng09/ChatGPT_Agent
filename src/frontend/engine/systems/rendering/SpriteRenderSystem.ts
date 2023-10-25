import EcsManager, { EntsWith } from "../../../infra/Ecs";
import { Vec3 } from "../../../infra/LinAlg";
import CClickable from "../../comps/CClickable";
import CSprite from "../../comps/CSprite";
import CTransform from "../../comps/CTransform";
import GameContext from "../../GameContext";

export default class SpriteRenderSystem {

  public run(gc: GameContext, ecs: EcsManager): void {

    const ents: [number, [CSprite, CTransform]][] = Array.from(ecs.getEntsWith(CSprite, CTransform));

    // need to sort for rendering to work properly
    ents.sort((a, b) => a[1][1].translation.y - b[1][1].translation.y);

    for (const [eid, [sprite, transform]] of ents) {
      const pos = gc.viewTransform.mulVec(new Vec3(transform.translation.x, transform.translation.y, 1));
      const img = sprite.getImage();
      if (!img) continue;
      const imgCrop = sprite.getImgCrop();

      const clickable = ecs.getComponent(eid, CClickable);
      if (clickable?.isSelected) {
        // if image is selected we draw it with an outline
        gc.canvasCtx.filter = 'brightness(150%)';
        const borderSize = 0;

        gc.canvasCtx.drawImage(
          img, imgCrop[0], imgCrop[1], imgCrop[2], imgCrop[3],
          /* actual left, top, width and heigth*/
          pos.x - borderSize,
          pos.y - 24 - borderSize, // offset by -24 to move feet to almost the bottom of tile
          sprite.width + 2 * borderSize,
          sprite.height + 2 * borderSize,
        );
        // clear the filter after drawing
        gc.canvasCtx.filter = 'none';
        continue; // skip drawing normal sprite for now
      }

      gc.canvasCtx.drawImage(
        img,
        /* Crop left, top, width and heigth*/
        imgCrop[0], imgCrop[1], imgCrop[2], imgCrop[3],
        /* actual left, top, width and heigth*/
        pos.x,
        pos.y - 24, // offset by -24 to move feet to almost the bottom of tile (need to add offset to the sprite?)
        sprite.width,
        sprite.height,
      );
    }
  }



}