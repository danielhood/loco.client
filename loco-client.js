var LocoClient;
(function (LocoClient) {
    var KeyHook = (function () {
        function KeyHook(renderCommandTextCallback, processCommandCallback) {
            this.cmdBuffer = "> ";
            this.renderCommandTextCallback = renderCommandTextCallback;
            this.processCommandCallback = processCommandCallback;
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
            else if (k == 8) {
                if (this.cmdBuffer.length > 2) {
                    this.cmdBuffer = this.cmdBuffer.substr(0, this.cmdBuffer.length - 1);
                }
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
            this.renderCommandTextCallback();
        };
        return KeyHook;
    }());
    LocoClient.KeyHook = KeyHook;
})(LocoClient || (LocoClient = {}));
var LocoClient;
(function (LocoClient) {
    var ObjectStore = (function () {
        function ObjectStore() {
            objectMap = new Map();
        }
        ObjectStore.prototype.getObject = function (id) {
            return objectMap.get(id);
        };
        ObjectStore.prototype.showAll = function (show) {
            this.visible = show;
        };
        return ObjectStore;
    }());
    LocoClient.ObjectStore = ObjectStore;
})(LocoClient || (LocoClient = {}));
var LocoClient;
(function (LocoClient) {
    var CurrentUser = (function () {
        function CurrentUser() {
        }
        return CurrentUser;
    }());
    LocoClient.CurrentUser = CurrentUser;
    var CurrentUserStore = (function () {
        function CurrentUserStore(currentUser) {
            this.currentUser = currentUser;
        }
        CurrentUserStore.prototype.getUser = function () {
            return this.currentUser;
        };
        CurrentUserStore.prototype.showMe = function (show) {
            this.visible = show;
        };
        return CurrentUserStore;
    }());
    LocoClient.CurrentUserStore = CurrentUserStore;
})(LocoClient || (LocoClient = {}));
/// <reference path="stores/objectStore.ts" />
/// <reference path="stores/currentUserStore.ts" />
var LocoClient;
(function (LocoClient) {
    var CommandProcessor = (function () {
        function CommandProcessor(renderCanvasCallback, renderTextCallback, objectStore, currentUserStore) {
            this.renderCanvasCallback = renderCanvasCallback;
            this.renderTextCallback = renderTextCallback;
            this.objectStore = objectStore;
            this.currentUserStore = currentUserStore;
        }
        CommandProcessor.prototype.processCommand = function (command) {
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
        };
        return CommandProcessor;
    }());
    LocoClient.CommandProcessor = CommandProcessor;
})(LocoClient || (LocoClient = {}));
/// <reference path="stores/objectStore.ts" />
/// <reference path="stores/currentUserStore.ts" />
var LocoClient;
(function (LocoClient) {
    var ObjectRenderer = (function () {
        function ObjectRenderer(canvas, objectStore, currentUserStore) {
            this.canvas = canvas;
            this.objectStore = objectStore;
            this.currentUserStore = currentUserStore;
            this.ctx = this.canvas.getContext("2d");
        }
        ObjectRenderer.prototype.renderAll = function () {
            var x = this.currentUserStore.getUser().X;
            var y = this.currentUserStore.getUser().Y;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.objectStore.visible) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(200 + x, 100 + y);
                this.ctx.stroke();
            }
        };
        return ObjectRenderer;
    }());
    LocoClient.ObjectRenderer = ObjectRenderer;
})(LocoClient || (LocoClient = {}));
/// <reference path="keyhook.ts" />
/// <reference path="stores/objectStore.ts" />
/// <reference path="stores/currentUserStore.ts" />
/// <reference path="commandProcessor.ts" />
/// <reference path="objectRenderer.ts" />
var LocoClient;
(function (LocoClient) {
    var mainCanvas;
    var msgText;
    var cmdText;
    var msgBuffer;
    var currentUserStore = new LocoClient.CurrentUserStore({ Id: "1", Username: "admin", FirstName: "admin", LastName: "admin", IsOnline: true, X: 0, Y: 0 });
    var objectStore = new LocoClient.ObjectStore();
    var objectRenderer;
    var commandProcessor;
    var keyHook;
    var showObject = false;
    function load() {
        // TODO: Buffered canvas:https://stackoverflow.com/questions/19666790/html5-canvas-100-height-and-width
        mainCanvas = document.getElementById("mainCanvas");
        mainCanvas.width = window.innerWidth;
        mainCanvas.height = window.innerHeight - 100;
        objectRenderer = new LocoClient.ObjectRenderer(mainCanvas, objectStore, currentUserStore);
        commandProcessor = new LocoClient.CommandProcessor(function () { return objectRenderer.renderAll(); }, renderTextWithMsg, objectStore, currentUserStore);
        msgText = document.getElementById("msgText");
        cmdText = document.getElementById("cmdText");
        msgText.style.width = cmdText.style.width = window.innerWidth.toString();
        keyHook = new LocoClient.KeyHook(function () { return renderText(); }, function (cmd) { return commandProcessor.processCommand(cmd); });
        keyHook.hook();
        renderTextWithMsg("loco-cli v0.1; User logged in: " + currentUserStore.getUser().Username);
    }
    LocoClient.load = load;
    function renderTextWithMsg(msg) {
        msgBuffer = msg;
        renderText();
    }
    function renderText() {
        msgText.innerText = msgBuffer;
        cmdText.innerText = keyHook.cmdBuffer;
    }
})(LocoClient || (LocoClient = {}));
window.onload = LocoClient.load;
