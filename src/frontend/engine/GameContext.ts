import EcsManager, { EntIdType, IGameContext } from "../infra/Ecs";
import KeyListener from "../infra/KeyListener";
import { Mat3, Vec2 } from "../infra/LinAlg";
import MouseListener from "../infra/MouseListener";
import CGridCollider from "./comps/CGridCollider";
import { InteractiveAction } from "./comps/CInteractive";
import CSprite from "./comps/CSprite";
import CTransform from "./comps/CTransform";


export type PlayerEnt = {
  eid: number,
  sprite: CSprite,
  transform: CTransform,
  collider: CGridCollider,
}

export default class GameContext implements IGameContext {

  public viewTransform = Mat3.identity();
  public frameCount: number = 0;
  public lastFrameDelta: number = 0;
  public conversationWithEntId: EntIdType | null = null;
  public spriteLookup: Map<string /*vec2*/, EntIdType[]> = new Map<string, EntIdType[]>();

  // todo combine listeners into single input mapper
  public readonly input: KeyListener;
  public readonly mouse: MouseListener;

  public readonly canvasCtx: CanvasRenderingContext2D;
  public playerEnt!: PlayerEnt;
  public currentInteraction: InteractiveAction | null = null;
  public playerStepsTaken: number = 0;

  constructor(
    public readonly canvas: HTMLCanvasElement,
    public readonly triggerReactComponentRender: () => void,
  ) {
    this.canvasCtx = canvas.getContext('2d')!;
    this.input = new KeyListener(canvas);
    this.mouse = new MouseListener(canvas);
  }

  public getSpriteDescriptionsInRegion(ecs: EcsManager, pos: Vec2, size: number): string[] {
    var entIds = this.getSpritesInRegion(pos, size);
    return entIds.map(eid => ecs.getComponent(eid, CSprite)?.description ?? "");
  }

  public getSpritesInRegion(pos: Vec2, size: number): EntIdType[] {
    const entIds: EntIdType[] = [];
    const spriteLookup = this.spriteLookup;

    // Iterate over all positions in the region and collect the entIds at each position
    for (let i = pos.y - size; i <= pos.y + size; i++) {
      for (let j = pos.x - size; j <= pos.x + size; j++) {
        if (pos.x === j && pos.y === i) continue; // only gets neighbours
        const hash = new Vec2(j, i).toString();
        if (spriteLookup.has(hash)) {
          const entIdList = spriteLookup.get(hash)!;
          for (const entId of entIdList) {
            entIds.push(entId);
          }
        }
      }
    }
    return entIds;
  }

}
