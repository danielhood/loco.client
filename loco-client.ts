/// <reference path="keyhook.ts" />

namespace LocoClient {
  var mainCanvas: HTMLCanvasElement;
  var ctx: CanvasRenderingContext2D;
  var msgText: HTMLDivElement;
  var cmdText: HTMLDivElement;
  var msgBuffer: string;
  var cmdBuffer: string;
  var keyShift: boolean = false;

  var x: number = 0;
  var y: number = 0;

  var keyHook = new KeyHook(processCommand, renderText);

  var showObject = false;

  export function load() {
    // TODO: Buffered canvas:https://stackoverflow.com/questions/19666790/html5-canvas-100-height-and-width
    mainCanvas = <HTMLCanvasElement>document.getElementById("mainCanvas");
    mainCanvas.width = window.innerWidth;
    mainCanvas.height = window.innerHeight - 100;

    ctx = mainCanvas.getContext("2d");

    msgText = <HTMLDivElement>document.getElementById("msgText");

    cmdText = <HTMLDivElement>document.getElementById("cmdText");
    msgText.style.width = cmdText.style.width = window.innerWidth.toString();

    msgBuffer = "loco-cli v0.1";

    keyHook.hook();

    renderCanvas();
    renderText();
  }

  function processCommand(command: string) {
    if (command == "draw") {
      showObject = true;
      renderCanvas();
    }
    else if (command == "clear") {
      showObject = false;
      renderCanvas();
    }
    else if (command == "left") {
      x = x-1;
      renderCanvas();
    }
    else if (command == "right") {
      x = x+1;
      renderCanvas();
    }
    else if (command == "up") {
      y = y-1;
      renderCanvas();
    }
    else if (command == "down") {
      y = y+1;
      renderCanvas();
    }
    else if (command == "help") {
      msgBuffer = "Commands: help, draw, clear, left, right, up, down"
      renderText();
    }
    else {
      msgBuffer = "Unknown command: " + command;
      renderText();
    }
  }

  function renderText() {
    msgText.innerText = msgBuffer;
    cmdText.innerText = keyHook.cmdBuffer;
  }

  function renderCanvas() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    if (showObject) {
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(200+x,100+y);
      ctx.stroke();
    }

  }

}


window.onload = LocoClient.load;
