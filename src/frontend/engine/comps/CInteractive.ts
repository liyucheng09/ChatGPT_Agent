import EcsManager from "../../infra/Ecs";
import GameContext from "../GameContext";


export type InteractiveAction = Generator;

// the way this works is on the first interaction, the on interact is
// called, does any initial set up and then returns and interactive action
// InteractiveActions are generators whose next function will be called
// each time the interact button is pressed again. The interaction
// is finished when the generator says it is done (or the interaction is cleared on the game context)
export default class CInteractive {
  constructor(public readonly onInteract: (gc: GameContext, ecs: EcsManager, entId: number) => InteractiveAction) { }
}