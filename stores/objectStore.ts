namespace LocoClient {

  export type ObjectEntity {
    id: string;
    type: string;
    name: string;
    x: number;
    y: number;
  }

  export class ObjectStore {
    objectMap: Map <string, ObjectEntity>;
    visible: boolean;

    constructor() {
      objectMap = new Map<string, ObjectEntity>();
    }

    getObject(id : string) : ObjectEntity {
      return objectMap.get(id);
    }

    showAll(show: boolean) {
      this.visible = show;
    }
  }
}
