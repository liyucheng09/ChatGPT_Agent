import { Vec2 } from "../../frontend/infra/LinAlg";

export interface ILocation {
  entrance: Vec2;
  outside: Vec2;
}

const locationData: { [key: string]: ILocation } = {
  ranch: {
    entrance: new Vec2(24, 45),
    outside: new Vec2(24, 48),
  },
  store: {
    entrance: new Vec2(21, 32),
    outside: new Vec2(21, 35),
  },
  "Henry and Carolines house": {
    entrance: new Vec2(32, 36),
    outside: new Vec2(32, 39),
  },
  "Doctors office": {
    entrance: new Vec2(15, 43),
    outside: new Vec2(15, 46),
  },
  "Brendan's house": {
    entrance: new Vec2(54, 42),
    outside: new Vec2(54, 45),
  },
  "forest on the plateau": {
    entrance: new Vec2(31, 19),
    outside: new Vec2(31, 19),
  },
  "abandoned shed in the forest": {
    entrance: new Vec2(19, 15),
    outside: new Vec2(19, 18),
  },
};

export interface ILocationContextInfo {
  description: string;
  mapId: number;
}

// starts with time, Then, a few moments later {timeMsg} at {locationDescription}
export const locationContext: { [key: number]: ILocationContextInfo } = {
  222: {
    description: `位于主岛的西北边缘。西面是汪洋大海，东面则是高原的悬崖。周围有几棵树和一片怪物出没的长草地。往南则是长安城的方向。`,
    mapId: 222,
  },
  254: {
    description: `位于主岛的东北边缘。东面是海洋，西面是高原的悬崖。附近有几棵树和常有妖怪出没的长草地。长安城就在南边。`,
    mapId: 254,
  },
  188: {
    description: `是高原上的森林区。森林里树木茂密，有几片怪物常出没的长草地。长安城就在南边。`,
    mapId: 188,
  },
  190: {
    description: `位于高原的一片森林中。你正站在一个维护得相当好的小木屋前。四周是茂密的树木和怪物常出没的草地。长安城就在南边。`,
    mapId: 190,
  },
  220: {
    description: `长安城，主岛上的城镇。`,
    mapId: 220,
  },
  253: {
    description: `连接主岛和东边小岛的桥梁。桥是木制的，非常狭窄，遇到对面来的人几乎无法并肩而过。`,
    mapId: 253,
  },
  221: {
    description: `位于主岛东部的小岛。岛上有一个属于布兰登的住所。这里花团锦簇，维护得很好，并通过一座木桥与主岛相连。`,
    mapId: 221,
  },
  191: {
    description: `怪物农场的一个围栏区域。这里有一片长草、几棵小树和灌木丛。要离开这里，你必须经过农场的侧门和主入口。`,
    mapId: 191,
  },
  219: {
    description: `长安城，就在医师的办公室前面。`,
    mapId: 219,
  },
  189: {
    description: `长安城，就在商店的前方。`,
    mapId: 189,
  },
  252: {
    description: `长安城，就在亨利和卡洛琳的房子前面。`,
    mapId: 252,
  },
  251: {
    description: `长安城，正对着农场的主入口。`,
    mapId: 251,
  },
};


export default locationData;