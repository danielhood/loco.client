/// <reference path="stores/objectStore.ts" />
/// <reference path="stores/currentUserStore.ts" />

namespace LocoClient {
  export class ObjectRenderer {
    objectStore: ObjectStore;
    currentUserStore: CurrentUserStore;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, objectStore: ObjectStore, currentUserStore: CurrentUserStore) {
      this.canvas = canvas;
      this.objectStore = objectStore;
      this.currentUserStore = currentUserStore;

      this.ctx = this.canvas.getContext("2d");
    }

    renderAll() {
      let x = this.currentUserStore.getUser().X;
      let y = this.currentUserStore.getUser().Y;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.objectStore.visible) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(200 + x, 100 + y);
        this.ctx.stroke();
      }

    }
  }

}
