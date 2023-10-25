import EcsManager, { EntsWith } from "../../infra/Ecs";
import CGridCollider from "../comps/CGridCollider";
import CInteractive from "../comps/CInteractive";
import GameContext from "../GameContext";
import GridMovementSystem from "./GridMovementSystem";

type CompOrder = [CGridCollider, CInteractive];
const constructors = [CGridCollider, CInteractive];

export default class PlayerInteractionSystem {

  public run(gc: GameContext, ecs: EcsManager): void {

    const isActionKeyDown = gc.input.isKeyDown("q");

    // continue the active interaction if there is one
    if (isActionKeyDown && gc.currentInteraction) {
      const val = gc.currentInteraction.next();
      if (val.done) {
        // clear the action if it returned finished
        gc.currentInteraction = null;
      }
      return;
    }

    if (!isActionKeyDown) return; // don't try to interact if key not pressed
    if (!gc.playerEnt.collider.gridPos) return; // player can't interact if not currently in grid
    if (gc.playerEnt.collider.nextGridPos) return; // player can't interact if currently moving

    // get grid position directly infront of the player
    const target = GridMovementSystem.getNeighbour(gc.playerEnt.collider.gridPos, gc.playerEnt.sprite.direction);
    const ents: EntsWith<CompOrder> = ecs.getEntsWith(...constructors);
    for (const [eid, [collider, interactive]] of ents) {
      if (collider.gridPos?.equals(target)) {
        // launch interactive and store update currentInteraction 
        gc.currentInteraction = interactive.onInteract(gc, ecs, eid);
      }
    }
  }
}
