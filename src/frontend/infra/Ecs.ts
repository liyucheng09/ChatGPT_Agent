export type EntIdType = number;

export type EntWith<T extends IComponent[]> = [EntIdType, T];
export type EntsWith<T extends IComponent[]> = IterableIterator<EntWith<T>>

// Define the Component interface
export interface IComponent { }

export interface IGameContext { }
export interface ISystem<IGameContext, T extends IComponent[]> {
  run(gc: IGameContext, ents: EntsWith<T>): void;
}

type ComponentConstructor<T extends IComponent> = new (...a: any[]) => T;

// Define the Index class
class Index<T extends IComponent[]> {

  public indexedComponents = new Map<EntIdType, T>();
  constructor(public readonly componentTypes: ComponentConstructor<T[number]>[]) { }

  private matches(eid: EntIdType, manager: EcsManager): boolean {
    for (const componentType of this.componentTypes) {
      if (!manager.hasComponent(eid, componentType)) {
        return false;
      }
    }
    return true;
  }
  // public getEntIds(): EntIdType[] {
  //   return Array.from(this.indexedComponents.keys());
  // }

  private addEnt(eid: EntIdType, manager: EcsManager) {
    const comps = this.componentTypes.map(compType => manager.getComponent(eid, compType)) as T;
    this.indexedComponents.set(eid, comps);
  }

  public removeEnt(eid: EntIdType) {
    this.indexedComponents.delete(eid);
  }

  public addEntIfMatch(eid: EntIdType, manager: EcsManager): boolean {
    if (this.matches(eid, manager)) {
      this.addEnt(eid, manager);
      return true;
    }
    return false;
  }
}

export interface IEcsManager {
  // ent functions
  createEnt(): EntIdType;
  deleteEnt(eid: EntIdType): boolean;
  getEnts(): IterableIterator<EntIdType>;
  getEntsWith<T extends IComponent[]>(...componentTypes: ComponentConstructor<T[number]>[]): EntsWith<T>;

  // component functions
  removeComponent<T extends IComponent>(eid: EntIdType, componentType: ComponentConstructor<T>): void;
  addComponent<T extends IComponent>(eid: EntIdType, component: T): T;
  getComponent<T extends IComponent>(eid: EntIdType, componentType: ComponentConstructor<T>): T;
  hasComponent<T extends IComponent>(eid: EntIdType, componentType: ComponentConstructor<T>): boolean;

  // index functions
  createIndex<T extends IComponent[]>(...componentTypes: ComponentConstructor<T[number]>[]): void;
  hasIndex<T extends IComponent[]>(...componentTypes: ComponentConstructor<T[number]>[]): boolean;
  removeIndex<T extends IComponent[]>(...componentTypes: ComponentConstructor<T[number]>[]): boolean;
}

// Define the EcsManager class
export default class EcsManager implements IEcsManager {
  private readonly componentStores: Map<string, Map<EntIdType, IComponent>>;
  private readonly indexes: Map<string, Index<any[]>>;
  private readonly entities: Set<EntIdType>;
  private nextEntId: number = 0;

  constructor() {
    this.componentStores = new Map<string, Map<EntIdType, IComponent>>();
    this.indexes = new Map<string, Index<any[]>>();
    this.entities = new Set<EntIdType>();
  }

  public createEnt(): EntIdType {
    var eid = this.nextEntId++;
    this.entities.add(eid);
    return eid;
  }

  public deleteEnt(eid: EntIdType): boolean {
    var wasDeleted = this.entities.delete(eid);
    this.componentStores.forEach((store) => {
      store.delete(eid);
    })
    return wasDeleted;
  }

  public getEnts(): IterableIterator<EntIdType> {
    return this.entities.values();
  }

  // Add a component to an entity
  // Returns the component passed in
  public addComponent<T extends IComponent>(eid: EntIdType, component: T): T {
    const store = this.getComponentStore(component.constructor.name);
    store.set(eid, component);
    this.updateIndexes(eid);
    return component;
  }

  // Remove a component from an entity
  public removeComponent<T extends IComponent>(eid: EntIdType, componentType: ComponentConstructor<T>): void {
    const store = this.getComponentStore(componentType.name);
    store.delete(eid);
    this.updateIndexes(eid);
  }

  // Get a component from an entity
  public getComponent<T extends IComponent>(eid: EntIdType, componentType: ComponentConstructor<T>): T {
    const store = this.getComponentStore(componentType.name);
    return store.get(eid) as T;
  }

  // Check if an entity has a component
  public hasComponent<T extends IComponent>(eid: EntIdType, componentType: ComponentConstructor<T>): boolean {
    const store = this.getComponentStore(componentType.name);
    return store.has(eid);
  }

  public debugEnt(eid: EntIdType): IComponent[] {
    const components: IComponent[] = []
    for (const [, store] of this.componentStores) {
      const component = store.get(eid);
      if (component) {
        components.push(component);
      }
    }
    return components;
  }

  // Get all entities with a given component
  // public getEntsWithComponent<T extends Component>(componentType: { new(): T }): Ent[] {
  //   const store = this.getComponentStore(componentType.name);
  //   return Array.from(store.keys()).map((id) => ({ id }));
  // }

  // Get all entities matching an index
  // public getEntIdsWith<T extends Component[]>(...componentTypes: ComponentConstructor<T[number]>[]): EntIdType[] {
  //   if (componentTypes.length === 1) {
  //     return this.getEntsWithComponent(componentTypes[0]).map(x => x.id);
  //   }
  //   const index = this.getIndex(...componentTypes);
  //   return index?.getEntIds() ?? [];
  // }

  // public entGetWith<T extends Component[]>(ent: Ent, ...componentTypes: ComponentConstructor<T[number]>[])
  //   : T[number][] {
  //   const components = componentTypes.map(compType => this.getComponentStore(compType.name).get(eid)) as T[number][];
  //   return components;
  // }

  // what if i make this extend the component constructors instead
  public getEntsWith<T extends IComponent[]>(...componentTypes: ComponentConstructor<T[number]>[])
    : EntsWith<T> {
    // if just on component type passed in, use the component store itself
    if (componentTypes.length === 1) {
      const store = this.getComponentStore(componentTypes[0].name);
      const iter = store.entries();
      const next = {
        [Symbol.iterator]() {
          return {
            next(): IteratorResult<[EntIdType, T]> {
              const result = iter.next();
              if (result.done) return { done: true, value: undefined };
              const [eid, component] = result.value;
              return { done: false, value: [eid, [component]] } as any;
            }
          };
        }
      } as IterableIterator<[EntIdType, T]>;
      return next;
    }

    // otherwise we try an index, (index must exist!)
    const index = this.getIndex(...componentTypes);
    if (!index) {
      // we could use the indexes we do have to intelligently get the ents.
      // basically compute an intersection starting with whatever has the smallest number
      // of components...
      throw new Error(`Index with key ${this.getIndexKey(...componentTypes)} does not exist`);
    }

    // need to swizzle index components to match the ordering of the arguments passed in
    const indexCompOrder = index.componentTypes.map(t => t.name);
    const requestedCompOrder = componentTypes.map(t => t.name);
    const swizzle = Array(requestedCompOrder.length);
    for (var i = 0; i < swizzle.length; i++) {
      swizzle[i] = indexCompOrder.indexOf(requestedCompOrder[i]);
    }

    const iter = index.indexedComponents.entries();
    return {
      [Symbol.iterator]() {
        return {
          next(): IteratorResult<[EntIdType, T]> {
            const result = iter.next();
            if (result.done) return { done: true, value: undefined };
            const [eid, components] = result.value as [number, T[number][]];
            const swizzled = Array(swizzle.length);
            for (var i = 0; i < swizzle.length; i++) {
              swizzled[i] = components[swizzle[i]];
            }
            return { done: false, value: [eid, swizzled] } as any;
          }
        };
      }
    } as IterableIterator<[EntIdType, T]>;
  }

  public createIndex<T extends IComponent[]>(...componentTypes: ComponentConstructor<T[number]>[]): void {
    if (componentTypes.length === 1) {
      throw new Error("Can't create an index with 1 component");
    }
    const key = this.getIndexKey(...componentTypes);
    if (this.indexes.has(key)) {
      console.log(`index already exists for ${key}`);
      return;
    }
    const index = new Index<T>(componentTypes);
    this.indexes.set(key, index);
    this.updateIndex(index);
  }

  public removeIndex<T extends IComponent[]>(...componentTypes: ComponentConstructor<T[number]>[]): boolean {
    const key = this.getIndexKey(...componentTypes);
    if (!this.indexes.has(key)) {
      console.log(`index does not exist for ${key}`);
      return false;
    }
    return this.indexes.delete(key);
  }

  public hasIndex<T extends IComponent[]>(...componentTypes: ComponentConstructor<T[number]>[]): boolean {
    const key = this.getIndexKey(...componentTypes);
    return this.indexes.has(key);
  }

  private getIndexKey<T extends IComponent[]>(...componentTypes: ComponentConstructor<T[number]>[]): string {
    componentTypes.sort((a, b) => a.name.localeCompare(b.name));
    return componentTypes.map((type) => type.name).join(",");
  }

  private getIndex<T extends IComponent[]>(...componentTypes: ComponentConstructor<T[number]>[]): Index<T> | undefined {
    const key = this.getIndexKey(...componentTypes);
    return this.indexes.get(key) as Index<T> | undefined;
  }

  private getComponentStore(componentType: string): Map<EntIdType, IComponent> {
    let store = this.componentStores.get(componentType);
    if (!store) {
      store = new Map<EntIdType, IComponent>();
      this.componentStores.set(componentType, store);
    }
    return store;
  }

  private updateIndexes(entity: EntIdType): void {
    this.indexes.forEach((index) => {
      this.updateIndex(index, entity);
    });
  }

  // overloaded to support 1 or all
  private updateIndex(index: Index<any>, entId?: EntIdType): void {
    if (entId) {
      index.addEntIfMatch(entId, this);
      return;
    }
    for (const eid of this.entities) {
      index.addEntIfMatch(eid, this);
    }
  }
}