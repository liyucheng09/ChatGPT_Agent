import npcData from "../data/npcs/NpcData";
import INpcRepo, { INpcModel } from "../interfaces/INpcRepo";

export default class NpcRepo implements INpcRepo {

  public async getById(id: number): Promise<INpcModel> {
    const index = this.getIndexOf(id);
    return npcData[index]!;
  }

  public async update(updated: INpcModel): Promise<INpcModel> {
    const index = this.getIndexOf(updated.id);
    if (index < 0) throw new Error(`NpcRepo could not find model with id ${updated.id}`);
    npcData[index] = updated;
    return updated;
  }

  private getIndexOf(npcId: number): number {
    const index = npcData.findIndex(npc => npc?.id === npcId);
    if (index < 0) throw new Error(`NpcRepo could not find model with id ${npcId}`);
    return index;
  }
}
