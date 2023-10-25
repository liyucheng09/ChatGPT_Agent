
import playerDown from "../../assets/img/playerdown.png";
import playerUp from "../../assets/img/playerup.png";
import playerLeft from "../../assets/img/playerleft.png";
import playerRight from "../../assets/img/playerright.png";
import henryleft from "../../assets/img/henryleft.png";
import henryright from "../../assets/img/henryright.png";
import henryup from "../../assets/img/henryup.png";
import henrydown from "../../assets/img/henrydown.png";
import carolleft from "../../assets/img/carolleft.png";
import carolright from "../../assets/img/carolright.png";
import carolup from "../../assets/img/carolup.png";
import caroldown from "../../assets/img/caroldown.png";
import joshyleft from "../../assets/img/joshyleft.png";
import joshyright from "../../assets/img/joshyright.png";
import joshyup from "../../assets/img/joshyup.png";
import joshydown from "../../assets/img/joshydown.png";
import momleft from "../../assets/img/momleft.png";
import momright from "../../assets/img/momright.png";
import momup from "../../assets/img/momup.png";
import momdown from "../../assets/img/momdown.png";
import items from "../../assets/img/items.png";
import { SpriteSheet } from "./comps/CSprite";
import { Vec2 } from "../infra/LinAlg";

const characterSpriteInfo = {
  numRows: 1,
  numCols: 4,
  spriteWidth: 48,
  spriteHeight: 68,
};

const itemSpriteInfo = {
  numRows: 1,
  numCols: 1,
  spriteWidth: 48,
  spriteHeight: 48,
};

const TypedAssets = {
  spriteSheets: {
    playerLeft: new SpriteSheet(playerLeft, characterSpriteInfo),
    playerRight: new SpriteSheet(playerRight, characterSpriteInfo),
    playerUp: new SpriteSheet(playerUp, characterSpriteInfo),
    playerDown: new SpriteSheet(playerDown, characterSpriteInfo),
    henryleft: new SpriteSheet(henryleft, characterSpriteInfo),
    henryright: new SpriteSheet(henryright, characterSpriteInfo),
    henryup: new SpriteSheet(henryup, characterSpriteInfo),
    henrydown: new SpriteSheet(henrydown, characterSpriteInfo),
    carolleft: new SpriteSheet(carolleft, characterSpriteInfo),
    carolright: new SpriteSheet(carolright, characterSpriteInfo),
    carolup: new SpriteSheet(carolup, characterSpriteInfo),
    caroldown: new SpriteSheet(caroldown, characterSpriteInfo),
    momleft: new SpriteSheet(momleft, characterSpriteInfo),
    momright: new SpriteSheet(momright, characterSpriteInfo),
    momup: new SpriteSheet(momup, characterSpriteInfo),
    momdown: new SpriteSheet(momdown, characterSpriteInfo),
    joshyleft: new SpriteSheet(joshyleft, characterSpriteInfo),
    joshyright: new SpriteSheet(joshyright, characterSpriteInfo),
    joshyup: new SpriteSheet(joshyup, characterSpriteInfo),
    joshydown: new SpriteSheet(joshydown, characterSpriteInfo),
    apple: new SpriteSheet(items, itemSpriteInfo, new Vec2(0, 2)),
    rock: new SpriteSheet(items, itemSpriteInfo, new Vec2(0, 3)),
    coins: new SpriteSheet(items, itemSpriteInfo, new Vec2(0, 0)),
    earrings: new SpriteSheet(items, itemSpriteInfo, new Vec2(0, 1)),
    shoes: new SpriteSheet(items, itemSpriteInfo, new Vec2(1, 1)),
  },
};

export default TypedAssets;