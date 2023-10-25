import EcsManager, { EntsWith, EntWith } from "../../infra/Ecs";
import { Vec2 } from "../../infra/LinAlg";
import findShortestPath from "../../infra/ShortestPath";
import CAgent from "../comps/CAgent";
import CGridCollider from "../comps/CGridCollider";
import CSprite from "../comps/CSprite";
import CTransform from "../comps/CTransform";
import GameContext from "../GameContext";
import { MoveDirection } from "./GridMovementSystem";

type CompOrder = [CAgent, CGridCollider, CTransform, CSprite];
const constructors = [CAgent, CGridCollider, CTransform, CSprite];

export default class AgentMovementSystem {

  // string hash of boundary grid position
  private staticBoundaries: Set<string>;
  constructor(boundaries: Vec2[], public readonly tileSize: number) {
    this.staticBoundaries = new Set(boundaries.map(x => x.toString()));
  }

  public run(gc: GameContext, ecs: EcsManager): void {
    const colliders: EntsWith<[CGridCollider]> = ecs.getEntsWith(CGridCollider);
    const ents: EntsWith<CompOrder> = ecs.getEntsWith(...constructors);
    for (const ent of ents) {
      this.runForAgent(gc, ent, colliders);
    }
  }

  private runForAgent(gc: GameContext, ent: EntWith<CompOrder>, colliders: EntsWith<[CGridCollider]>) {
    const [eid, [, agentCollider, agentTransform, agentSprite]] = ent;

    let shouldAnimateAgent = agentSprite.animFrame % 2 !== 0;

    // update agent transform if they have a next grid position
    if (agentCollider.nextGridPos && agentCollider.gridPos) {
      const delta = agentCollider.nextGridPos.sub(agentCollider.gridPos);
      agentTransform.translation.add_(delta.mul(3));
      shouldAnimateAgent = true;

      // if they've reached the location
      const targetTranslation = agentCollider.nextGridPos.mul(this.tileSize);
      if (agentTransform.translation.distanceCompare(targetTranslation, 0.1)) {
        agentCollider.gridPos = agentCollider.nextGridPos;
        agentCollider.nextGridPos = null;
        agentTransform.translation = agentCollider.gridPos.mul(this.tileSize);
      }
    }

    // agent cant move if they are in a conversation
    if (gc.conversationWithEntId === eid) return;

    // run pathfinding if agent has target but no path
    this.maybeUpdatePathFinding(ent);

    // try updating nextGridPos to an open position along the path
    this.maybeUpdateNextPosition(ent, colliders);

    // update character animation
    if (shouldAnimateAgent && gc.frameCount % 10 === 0) {
      agentSprite.animFrame += 1;
      agentSprite.animFrame %= 4;
    }
  }

  private maybeUpdatePathFinding(ent: EntWith<CompOrder>) {
    const [eid, [agent, agentCollider, , agentSprite]] = ent;
    if (agent.movementPath) return; // agent already has a movement path
    if (!agentCollider.gridPos) return; // if agent not in grid return
    if (agentCollider.nextGridPos) return; // if agent already has next position return
    if (!agent.targetGridPos) return;
    if (agentCollider.gridPos.equals(agent.targetGridPos)) return;


    // at this point, the agent has a target position, but has no path to get there
    // TODO get other sprites and include in pathing?
    const path = findShortestPath(agentCollider.gridPos, agent.targetGridPos, this.staticBoundaries);
    if (path) {
      console.log("Found shortest path");
      agent.movementPath = path;
      agent.movementPathIndex = 0;
    } else {
      console.log("Could not find path");
      agent.targetGridPos = null; // clear target grid position to avoid repeating calculation
    }

  }

  private maybeUpdateNextPosition(ent: EntWith<CompOrder>, colliders: EntsWith<[CGridCollider]>) {
    const [eid, [agent, agentCollider, , agentSprite]] = ent;
    if (!agentCollider.gridPos) return; // if agent not in grid return
    if (agentCollider.nextGridPos) return; // if agent already has next position return

    // if agent is at target position then update to standby
    if (agent.targetGridPos && agentCollider.gridPos.equals(agent.targetGridPos)) {
      this.stopAgentMovement(agent);
      return;
    }

    // check if agent is at current path position, if so then update to next position in path
    const currentPathPos = agent.currentPathPos;
    if (currentPathPos && agentCollider.gridPos.equals(currentPathPos)) {
      agent.movementPathIndex! += 1;
      const direction = this.getDirectionToFace(agentCollider.gridPos, agent.currentPathPos);
      if (direction) {
        agentSprite.direction = direction;
      }
    }

    // finally try to move agent to next path position if it is open
    const agentNextPathPos = agent.currentPathPos;
    if (agentNextPathPos && this.isPositionOpen(eid, agentNextPathPos, colliders)) {
      agentCollider.nextGridPos = agentNextPathPos;
    }
  }

  private stopAgentMovement(agent: CAgent) {
    // if (agent.currentAction !== "move") return;
    agent.movementPath = null;
    agent.movementPathIndex = -1;
    agent.targetGridPos = null;
    agent.currentAction = "standby";
  }

  private getDirectionToFace(currentPos: Vec2, targetPos: Vec2 | null): MoveDirection | null {
    if (!targetPos) return null;
    if (currentPos.equals(targetPos)) return null;
    const delta = targetPos.sub(currentPos);

    if (delta.x > 0) return "right";
    if (delta.x < 0) return "left";
    if (delta.y > 0) return "down";
    if (delta.y < 0) return "up";
    return null;
  }

  /**
   * 
   * @param eid The ent id that is trying to move. Necessary so that they dont pick up self collisions
   * @param pos The grid position they want to check if its available
   * @param colliders The other colliders in the scene to check
   * @returns 
   */
  private isPositionOpen(entId: number, pos: Vec2, colliders: EntsWith<[CGridCollider]>): boolean {
    if (this.staticBoundaries.has(pos.toString())) {
      return false;
    }
    for (const [eid, [collider]] of colliders) {
      if (entId === eid) continue;
      if (collider.gridPos?.equals(pos)) return false;
      if (collider.nextGridPos?.equals(pos)) return false;
    }
    return true;
  }

  private move(pos: Vec2, direction: MoveDirection): Vec2 {
    switch (direction) {
      case "left":
        return pos.add(new Vec2(-1, 0));
      case "right":
        return pos.add(new Vec2(1, 0));
      case "up":
        return pos.add(new Vec2(0, -1));
      case "down":
        return pos.add(new Vec2(0, 1));
    }
  }
}
