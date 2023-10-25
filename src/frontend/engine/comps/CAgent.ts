import { Vec2 } from "../../infra/LinAlg";

export type AgentActionType = "standby" | "move";

export default class CAgent {

  constructor(public readonly agentId: number) { }
  public targetGridPos: Vec2 | null = null;
  public movementPath: Vec2[] | null = null;
  public movementPathIndex: number = -1;
  public currentAction: AgentActionType = "standby";

  get currentPathPos(): Vec2 | null {
    // return null if path is invalid
    if (!this.movementPath) return null;
    if (this.movementPathIndex === null) return null;
    if (this.movementPathIndex < 0) return null;
    if (this.movementPathIndex >= this.movementPath.length) return null;
    return this.movementPath[this.movementPathIndex];
  }
}