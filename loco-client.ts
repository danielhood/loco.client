/// <reference path="commands/keyhook.ts" />
/// <reference path="commands/commandProcessor.ts" />
/// <reference path="stores/objectStore.ts" />
/// <reference path="stores/currentUserStore.ts" />
/// <reference path="renderers/objectRenderer.ts" />


namespace LocoClient {
  var mainCanvas: HTMLCanvasElement;
  var msgText: HTMLDivElement;
  var cmdText: HTMLDivElement;
  var msgBuffer: string;

  let currentUserStore = new CurrentUserStore(
    {Id: "1", Username: "admin", FirstName: "admin", LastName: "admin", IsOnline: true, X: 0, Y: 0}
  );

  let objectStore = new ObjectStore();

  var objectRenderer: ObjectRenderer;
  var commandProcessor: CommandProcessor;
  var keyHook: KeyHook;

  var showObject = false;

  export function load() {
    // TODO: Buffered canvas:https://stackoverflow.com/questions/19666790/html5-canvas-100-height-and-width
    mainCanvas = <HTMLCanvasElement>document.getElementById("mainCanvas");
    mainCanvas.width = window.innerWidth;
    mainCanvas.height = window.innerHeight - 100;

    objectRenderer = new ObjectRenderer(mainCanvas, objectStore, currentUserStore);

    commandProcessor = new CommandProcessor(
      () => objectRenderer.renderAll(),
      renderTextWithMsg, objectStore, currentUserStore);

    msgText = <HTMLDivElement>document.getElementById("msgText");
    cmdText = <HTMLDivElement>document.getElementById("cmdText");

    msgText.style.width = cmdText.style.width = window.innerWidth.toString();

    keyHook = new KeyHook(
      () => renderText(),
      (cmd: string) => commandProcessor.processCommand(cmd));

    keyHook.hook();

    renderTextWithMsg("loco-cli v0.1; User logged in: " + currentUserStore.getUser().Username);
  }

  function renderTextWithMsg(msg: string) {
    msgBuffer = msg;
    renderText();
  }

  function renderText() {
    msgText.innerText = msgBuffer;
    cmdText.innerText = keyHook.cmdBuffer;
  }

}


window.onload = LocoClient.load;
