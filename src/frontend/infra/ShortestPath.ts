import { Vec2 } from "./LinAlg";

const manhattanDistance = (p1: Vec2, p2: Vec2) => Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);

const manhattanNeighbours = [new Vec2(0, 1), new Vec2(0, -1), new Vec2(1, 0), new Vec2(-1, 0)];

/**
 * 
 * @param start Starting location
 * @param target Target location
 * @param boundaries Set of boundaries, (string vec2 objects)
 * @returns The shortest manhattan path, null if it does not exist
 */
export default function findShortestPath(start: Vec2, target: Vec2, boundaries: Set<string>): Vec2[] | null {

  const heuristic = manhattanDistance;

  // Create a map to keep track of the cost of reaching each point
  const costMap: Map<string, number> = new Map();
  costMap.set(start.toString(), 0);

  // Create a map to keep track of the parent node for each point
  const parentMap: Map<string, Vec2> = new Map();
  parentMap.set(start.toString(), start);

  // Create a priority queue to store candidate points
  const queue: Vec2[] = [start];

  // Loop until we find the target or the queue is empty
  while (queue.length > 0) {

    // Get the point with the lowest estimated total cost
    const current = queue.shift()!;

    // If we've reached the target, reconstruct the path and return it
    if (current.equals(target)) {
      const path: Vec2[] = [];
      let node: Vec2 | undefined = current;
      while (node && !node.equals(start)) {
        path.unshift(node);
        node = parentMap.get(node.toString());
      }
      path.unshift(start);
      return path;
    }

    // Check each adjacent point and add it to the queue if it's not blocked
    for (const direction of manhattanNeighbours) {
      const neighbor = current.add(direction);
      if (
        !boundaries.has(neighbor.toString()) &&
        (!costMap.has(neighbor.toString()) || costMap.get(current.toString())! + 1 < costMap.get(neighbor.toString())!)
      ) {
        costMap.set(neighbor.toString(), costMap.get(current.toString())! + 1);
        parentMap.set(neighbor.toString(), current);
        const costEstimate = costMap.get(neighbor.toString())! + heuristic(neighbor, target);
        let i = 0;
        while (i < queue.length && costEstimate > costMap.get(queue[i].toString())! + heuristic(queue[i], target)) {
          i++;
        }
        queue.splice(i, 0, neighbor);
      }
    }
  }

  // If we didn't find a path, return null
  return null;
}
