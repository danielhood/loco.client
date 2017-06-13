namespace LocoClient {
  type RenderCommandTextCallback = () => any;
  type ProcessCommandCallback = (cmd: string) => any;
  type MapKeycodeCall = (k: number) => any;

  export class KeyHook {
      cmdBuffer: string;
      renderCommandTextCallback: RenderCommandTextCallback;
      processCommandCallback: ProcessCommandCallback;

      constructor(renderCommandTextCallback: RenderCommandTextCallback, processCommandCallback: ProcessCommandCallback) {
        this.cmdBuffer = "> ";
        this.renderCommandTextCallback = renderCommandTextCallback;
        this.processCommandCallback = processCommandCallback;
      }

      //mapKeycode (k: number) : void {
      mapKeycode (k: number) {
        if (k >= 65 && k <= 90 || k == 32) {
          this.cmdBuffer += String.fromCharCode(k).toLowerCase();
          return;
        }
        else if (k == 13) {
          this.processCommandCallback(this.cmdBuffer.substr(2, this.cmdBuffer.length-2));
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

      }

      hook() {
        // Needs to be defined with lambda to properly resolve this: https://stackoverflow.com/questions/16157839/typescript-this-inside-a-class-method
        document.addEventListener('keydown', (e: KeyboardEvent) => this.keyHandler(e), false);
      }

      keyHandler(e: KeyboardEvent) {
        this.mapKeycode(e.keyCode);
        this.renderCommandTextCallback();
      }

  }
}
