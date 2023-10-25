import EcsManager, { EntsWith } from "../../infra/Ecs";
import { Vec2 } from "../../infra/LinAlg";
import CGridCollider from "../comps/CGridCollider";
import GameContext from "../GameContext";

export interface ITileLayer {
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: string;
  visible: true;
  width: number;
  x: number;
  y: number;
}

export type MoveDirection = "up" | "down" | "left" | "right";

export default class GridMovementSystem {

  // string hash of boundary grid position
  private staticBoundaries: Set<string>;

  constructor(boundaries: Vec2[], public readonly tileSize: number) {
    this.staticBoundaries = new Set(boundaries.map(x => x.toString()));
  }

  public run(gc: GameContext, ecs: EcsManager): void {
    const colliders: EntsWith<[CGridCollider]> = ecs.getEntsWith(CGridCollider);
    const playerCollider = gc.playerEnt.collider;
    let shouldAnimatePlayer = gc.playerEnt.sprite.animFrame % 2 !== 0;

    // update player transform if they have a next grid position
    if (playerCollider.nextGridPos && playerCollider.gridPos) {
      const delta = playerCollider.nextGridPos.sub(playerCollider.gridPos);
      gc.playerEnt.transform.translation.add_(delta.mul(3));
      shouldAnimatePlayer = true;

      // if they've reached the location
      const targetTranslation = playerCollider.nextGridPos.mul(this.tileSize);
      if (gc.playerEnt.transform.translation.distanceCompare(targetTranslation, 0.1)) {
        playerCollider.gridPos = playerCollider.nextGridPos;
        playerCollider.nextGridPos = null;
        gc.playerEnt.transform.translation = playerCollider.gridPos.mul(this.tileSize);
      }
    }

    // cant move during conversation
    if (gc.conversationWithEntId !== null) return;

    // see if player can move, and update target position if they can
    let playerTargetPos: Vec2 | null = null;
    const dir = gc.input.getLastKeyDown("a", "w", "s", "d");

    if (dir && playerCollider.gridPos && !playerCollider.nextGridPos) {
      if (dir === "a") {
        playerTargetPos = GridMovementSystem.getNeighbour(playerCollider.gridPos, "left");
        gc.playerEnt.sprite.direction = "left";
      } else if (dir === "d") {
        playerTargetPos = GridMovementSystem.getNeighbour(playerCollider.gridPos, "right");
        gc.playerEnt.sprite.direction = "right";
      } else if (dir === "w") {
        playerTargetPos = GridMovementSystem.getNeighbour(playerCollider.gridPos, "up");
        gc.playerEnt.sprite.direction = "up";
      } else if (dir === "s") {
        playerTargetPos = GridMovementSystem.getNeighbour(playerCollider.gridPos, "down");
        gc.playerEnt.sprite.direction = "down";
      }
    }

    if (playerTargetPos && this.isPositionOpen(gc.playerEnt.eid, playerTargetPos, colliders)) {
      playerCollider.nextGridPos = playerTargetPos;
      gc.playerStepsTaken += 1;

      // todo start using input mapper and clean this up
      // const directions = ["left", "right", "up", "down"];
      // const pressed = ["a", "d", "w", "s"];
      // const index = pressed.indexOf(dir ?? "");
      // if (index >= 0) {
      //   console.log("set direction " + directions[index]);
      //   gc.playerEnt.sprite.setDirection(directions[index] as MoveDirection);
      // }
    }

    if (shouldAnimatePlayer && gc.frameCount % 10 === 0) {
      gc.playerEnt.sprite.animFrame += 1;
      gc.playerEnt.sprite.animFrame %= 4;
    }
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

    // todo, optimize collision detection with a hashset
    for (const [eid, [collider]] of colliders) {
      if (entId === eid) continue;
      if (collider.gridPos?.equals(pos)) return false;
      if (collider.nextGridPos?.equals(pos)) return false;
    }
    return true;
  }

  public static getNeighbour(pos: Vec2, direction: MoveDirection): Vec2 {
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

  public static collisionsFromTileLayer(tileLayer: ITileLayer): Vec2[] {
    var collisions: Vec2[] = [];
    for (var i = 0; i < tileLayer.width; i++) {
      for (var j = 0; j < tileLayer.height; j++) {
        const value = tileLayer.data[i * tileLayer.width + j];
        if (value > 0) collisions.push(new Vec2(j, i));
      }
    }
    return collisions;
  }
}