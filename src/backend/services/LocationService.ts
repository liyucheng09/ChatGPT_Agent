import { ITileLayer } from "../../frontend/engine/systems/GridMovementSystem";
import { Vec2 } from "../../frontend/infra/LinAlg";
import { ILocationContextInfo } from "../data/locationData";

export default class LocationService {

  private _lookup: Map<string, ILocationContextInfo> = new Map<string, ILocationContextInfo>();

  constructor(public locationContext: { [key: number]: ILocationContextInfo }, tileLayer: ITileLayer) {

    // build look up map to get location context
    for (var i = 0; i < tileLayer.width; i++) {
      for (var j = 0; j < tileLayer.height; j++) {
        const value = tileLayer.data[i * tileLayer.width + j];
        if (value > 0 && locationContext[value]) {
          var gridPos = new Vec2(j, i);
          this._lookup.set(gridPos.toString(), locationContext[value]);
        }
      }
    }
  }

  public lookup(pos: Vec2): ILocationContextInfo | null {
    return this._lookup.get(pos.toString()) || null;
  }
}