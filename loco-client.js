var LocoClient;
(function (LocoClient) {
    var KeyHook = (function () {
        function KeyHook(processCommandCallback, renderCommandCallback) {
            this.cmdBuffer = "> ";
            this.processCommandCallback = processCommandCallback;
            this.renderCommandCallback = renderCommandCallback;
        }
        //mapKeycode (k: number) : void {
        KeyHook.prototype.mapKeycode = function (k) {
            if (k >= 65 && k <= 90 || k == 32) {
                this.cmdBuffer += String.fromCharCode(k).toLowerCase();
                return;
            }
            else if (k == 13) {
                this.processCommandCallback(this.cmdBuffer.substr(2, this.cmdBuffer.length - 2));
                this.cmdBuffer = "> ";
                return;
            }
            else if (k == 8 && this.cmdBuffer.length > 2) {
                this.cmdBuffer = this.cmdBuffer.substr(0, this.cmdBuffer.length - 1);
            }
            else if (k == 27) {
                this.cmdBuffer = "> ";
            }
            else if (k == 37) {
                this.processCommandCallback("left");
            }
            else if (k == 38) {
                this.processCommandCallback("up");
            }
            else if (k == 39) {
                this.processCommandCallback("right");
            }
            else if (k == 40) {
                this.processCommandCallback("down");
            }
            else {
                this.processCommandCallback(k.toString());
            }
        };
        KeyHook.prototype.hook = function () {
            var _this = this;
            // Needs to be defined with lambda to properly resolve this: https://stackoverflow.com/questions/16157839/typescript-this-inside-a-class-method
            document.addEventListener('keydown', function (e) { return _this.keyHandler(e); }, false);
        };
        KeyHook.prototype.keyHandler = function (e) {
            this.mapKeycode(e.keyCode);
            this.renderCommandCallback();
        };
        return KeyHook;
    }());
    LocoClient.KeyHook = KeyHook;
})(LocoClient || (LocoClient = {}));
/// <reference path="keyhook.ts" />
var LocoClient;
(function (LocoClient) {
    var mainCanvas;
    var ctx;
    var msgText;
    var cmdText;
    var msgBuffer;
    var cmdBuffer;
    var keyShift = false;
    var x = 0;
    var y = 0;
    var keyHook = new LocoClient.KeyHook(processCommand, renderText);
    var showObject = false;
    function load() {
        // TODO: Buffered canvas:https://stackoverflow.com/questions/19666790/html5-canvas-100-height-and-width
        mainCanvas = document.getElementById("mainCanvas");
        mainCanvas.width = window.innerWidth;
        mainCanvas.height = window.innerHeight - 100;
        ctx = mainCanvas.getContext("2d");
        msgText = document.getElementById("msgText");
        cmdText = document.getElementById("cmdText");
        msgText.style.width = cmdText.style.width = window.innerWidth.toString();
        msgBuffer = "loco-cli v0.1";
        keyHook.hook();
        renderCanvas();
        renderText();
    }
    LocoClient.load = load;
    function processCommand(command) {
        if (command == "draw") {
            showObject = true;
            renderCanvas();
        }
        else if (command == "clear") {
            showObject = false;
            renderCanvas();
        }
        else if (command == "left") {
            x = x - 1;
            renderCanvas();
        }
        else if (command == "right") {
            x = x + 1;
            renderCanvas();
        }
        else if (command == "up") {
            y = y - 1;
            renderCanvas();
        }
        else if (command == "down") {
            y = y + 1;
            renderCanvas();
        }
        else if (command == "help") {
            msgBuffer = "Commands: help, draw, clear, left, right, up, down";
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
            ctx.moveTo(x, y);
            ctx.lineTo(200 + x, 100 + y);
            ctx.stroke();
        }
    }
})(LocoClient || (LocoClient = {}));
window.onload = LocoClient.load;
