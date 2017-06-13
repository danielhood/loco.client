/// <reference path="stores/objectStore.ts" />
/// <reference path="stores/currentUserStore.ts" />

namespace LocoClient {
  type RenderCanvasCallback = () => any;
  type RenderTextCallback = (msg: string) => any;

  export class CommandProcessor {
    renderCanvasCallback: RenderCanvasCallback;
    renderTextCallback: RenderTextCallback;
    objectStore: ObjectStore;
    currentUserStore: CurrentUserStore;

    constructor(renderCanvasCallback: RenderCanvasCallback,renderTextCallback: RenderTextCallback, objectStore: ObjectStore, currentUserStore: CurrentUserStore) {
      this.renderCanvasCallback = renderCanvasCallback;
      this.renderTextCallback = renderTextCallback;
      this.objectStore = objectStore;
      this.currentUserStore = currentUserStore;
    }

    processCommand(command: string) {
      if (command == "draw") {
        this.objectStore.showAll(true);
        this.renderCanvasCallback();
      }
      else if (command == "clear") {
        this.objectStore.showAll(false);
        this.renderCanvasCallback();
      }
      else if (command == "left") {
        this.currentUserStore.getUser().X--;
        this.renderCanvasCallback();
      }
      else if (command == "right") {
        this.currentUserStore.getUser().X++;
        this.renderCanvasCallback();
      }
      else if (command == "up") {
        this.currentUserStore.getUser().Y--;
        this.renderCanvasCallback();
      }
      else if (command == "down") {
        this.currentUserStore.getUser().Y++;
        this.renderCanvasCallback();
      }
      else if (command == "help") {
        this.renderTextCallback("Commands: help, draw, clear, left, right, up, down");
      }
      else {
        this.renderTextCallback("Unknown command: " + command);
      }
    }
  }
}
