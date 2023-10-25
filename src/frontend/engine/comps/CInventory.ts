import TypedAssets from "../TypedAsset";
import { SpriteSheet } from "./CSprite";

export const itemDefinitons: IItemDefinition[] = [
  {
    slug: "earings",
    name: "Caroline's Earrings",
    description: "A pair of Gold earrings with a small diamond",
    keyItem: true,
    spriteSheet: TypedAssets.spriteSheets.earrings,
  },
  {
    slug: "brothers-shoes",
    name: "Old sneakers",
    description: "Joshua's old sneakers",
    keyItem: true,
    spriteSheet: TypedAssets.spriteSheets.shoes,
  },
  {
    slug: "apple",
    name: "Apple",
    description: "A shiny red apple, monsters like to eat these.",
    keyItem: false,
    spriteSheet: TypedAssets.spriteSheets.apple,
  },
  {
    slug: "rock",
    name: "Rock",
    description: "Just a rock, maybe you could throw these at monsters to make them easier to catch",
    keyItem: false,
    spriteSheet: TypedAssets.spriteSheets.rock,
  },
  {
    slug: "coins",
    name: "Coins",
    description: "Coins! Don't spend them all in one place.",
    keyItem: false,
    spriteSheet: TypedAssets.spriteSheets.coins,
  },
];

export interface IItemDefinition {
  slug: string;
  name: string;
  description: string;
  keyItem: boolean;
  spriteSheet: SpriteSheet;
}

export class CItem {
  constructor(public readonly def: IItemDefinition, public count: number = 0) { }
}

export class Inventory {
  items: Map<string, CItem> = new Map();
  coins: number = 0;
}
