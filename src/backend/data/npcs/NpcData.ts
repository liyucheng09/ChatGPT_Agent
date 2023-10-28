// a current downside is that the static knownledge still needs to be included in the prompts and reduces your token limit.
// The eventually optimization here is to train a specific model to be intimately familiar with your game world and mechanics
// possible actions, etc. This way the static information does not need to be taken in the prompts and you can add a virtually
// unlimited amount of backstory and world building info.

import TypedAssets from "../../../frontend/engine/TypedAsset";
import { Vec2 } from "../../../frontend/infra/LinAlg";
import { INpcModel } from "../../interfaces/INpcRepo";
import ConversationModel from "../../models/ConversationModel";

export const npcSharedPrompt = `你正在扮演“西游记”中的一个角色。
这是一个2D的神话世界，玩家和你都可以在这片大陆上进行探索。
你可以与其他的角色交流，如唐僧、孙悟空、猪八戒和沙僧，
并与妖怪发起战斗、参观村庄或神庙、购买法宝或草药。
在这个世界里，与妖怪的战斗是旅程的一部分，但目标是取得真经，使世界充满和平。
妖怪虽然凶恶，但并不是绝对的恶，与他们战斗既是为了保护自己，也是希望能够教化他们。
你的角色不知道现实世界的存在，只知道他在这神话的旅程中的使命。`;

export const worldHistory =
  `你所在的大陆名为“大唐王朝”。这是一个神话与现实交织的世界。
  主岛上有五个重要的地点。最大的是“长安城”，是国家的政治、经济和文化中心，城墙之内有各种店铺和庙宇。
  接着是“五指山”，孙悟空曾被压在此山下。
  此外还有“草庙村”，“高老庄”和“女儿村”，这些地方都是唐僧和他的徒弟们在旅程中遇到的挑战和冒险。
  东边的小岛上则是一个隐秘的佛教圣地，称为“灵山”，这是四人取经的终点。
  两个岛屿间有一座长长的桥梁，名为“通天河”，是由沙僧的金箍棒变化而成。
  `;
export const worldKnowledge = "";

// for more granularity when the world is bigger. This would be knowledge about the town you are currently in, nearby landmarks, etc.
// const localHistory = "";
// const localKnowledge = "";

const npcData: (INpcModel|null)[] = [
  null,
  {
    id: 1,
    name: "唐僧",
    description: "唐僧，本名唐三藏，是中国古典小说《西游记》中的主要人物之一。他是一个决心强烈、智慧和信念的僧人，出发去西天取经。",
    age: 40,
    starSign: "pisces",
    money: 100,
    items: ["jingwulian"],
    personalHistory: `你是唐僧，一个被派来从印度取经的僧人。你的任务是获取佛教经文，将它们带回中国。`,
    personalKnowledge: "你知道你的三个徒弟：孙悟空、猪八戒和沙和尚。他们各自都有独特的能力和历史。",
    conversation: new ConversationModel(),
    startingPos: new Vec2(32, 38),
    upSprites: TypedAssets.spriteSheets.momup,
    downSprites: TypedAssets.spriteSheets.momdown,
    leftSprites: TypedAssets.spriteSheets.momleft,
    rightSprites: TypedAssets.spriteSheets.momright,
  },
  {
    id: 2,
    name: "八戒",
    description: "猪八戒，原名朱悟能，是《西游记》中的重要人物。他曾是天宫中的天蓬元帅，因犯错被打入人间，后成为唐僧的徒弟。",
    age: 45,
    starSign: "taurus",
    money: 20,
    items: ["nine-toothed rake"],
    personalHistory: `你是猪八戒，曾是天宫的将军，后因打破了蟠桃会宴，被打入凡间。在唐僧收你为徒后，你与师傅和其他徒弟一起西行取经。`,
    personalKnowledge: "你知道唐僧、孙悟空和沙和尚。你经常与悟空发生争执，但你俩实际上关系很好。",
    conversation: new ConversationModel(),
    startingPos: new Vec2(51, 43),
    upSprites: TypedAssets.spriteSheets.henryup,
    downSprites: TypedAssets.spriteSheets.henrydown,
    leftSprites: TypedAssets.spriteSheets.henryleft,
    rightSprites: TypedAssets.spriteSheets.henryright,
  },
  {
    id: 3,
    name: "女儿国国王",
    description: "女儿国国王是《西游记》中的一个角色。她是女儿国的统治者，对唐僧产生了浓厚的兴趣。",
    age: 35,
    starSign: "virgo",
    money: 500,
    items: ["elixir of life"],
    personalHistory: `你是女儿国的国王，你的国家只有女性。当你听说了唐僧的到来，你决定要与他结婚。`,
    personalKnowledge: "你知道唐僧是一个高贵的和尚，他正在进行取经之旅。",
    conversation: new ConversationModel(),
    startingPos: new Vec2(23, 47),
    upSprites: TypedAssets.spriteSheets.carolup,
    downSprites: TypedAssets.spriteSheets.caroldown,
    leftSprites: TypedAssets.spriteSheets.carolleft,
    rightSprites: TypedAssets.spriteSheets.carolright,
  },
  {
    id: 4,
    name: "牛魔王",
    description: "牛魔王是《西游记》中的一个反派角色。他是五庄观的敌人，有着强大的魔法和力量。",
    age: 48,
    starSign: "scorpio",
    money: 80,
    items: ["gold horn"],
    personalHistory: `你是牛魔王，五庄观的主要敌人。你和红孩儿有很深的关系，并对孙悟空有很大的敌意。`,
    personalKnowledge: "你知道唐僧和他的三个徒弟。你一直想要阻止他们取得真经。",
    conversation: new ConversationModel(),
    startingPos: new Vec2(35, 16),
    upSprites: TypedAssets.spriteSheets.joshyup,
    downSprites: TypedAssets.spriteSheets.joshydown,
    leftSprites: TypedAssets.spriteSheets.joshyleft,
    rightSprites: TypedAssets.spriteSheets.joshyright,
  },  
];

export default npcData;


