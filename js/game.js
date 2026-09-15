const TARGET_FPS = 60;

const TARGET_RENDER_MS = 1000 / TARGET_FPS;
let lastRender = 0;

class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Game state
    this.isRunning = false;
    // can't remember why I had this, but it seems correct

    // Canvas dimensions
    this.width = GAME_WIDTH;
    this.height = GAME_HEIGHT;

    // Scene management
    this.scene = "level"; // level only for now

    // Input handling
    this.keys = {};
    
    this.intents = {};

    // this.keysPressed = {}; // For single keypress detection

    // Initialize modules
    this.world = new WorldMap(this);
    this.levelManager = new LevelManager(
      this,
      new Position(6, 1),
      "BEGIN",
      0,
      0,
    );

    this.assetsPreloaded = false;
    this.loadedImages = new Map();

    this.fontsLoaded = false;

    this.mouse = new Position();
    this.mouseListeners = {};
    this.exitClickListeners = [];
    this.hoveredButton = undefined;

    this.rebindModal = new RebindModal(this);

    this.init();
  }

  init() {
    // Set canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.setupEventListeners();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.textRendering = "geometricPrecision";

    console.log("Game initialized");
  }

  setupEventListeners() {
    // Gamepad events
    /*
    document.getElementById("dpad-up").addEventListener("click", () => {
      this.handleKeyPress("ArrowUp");
    });
    document.getElementById("dpad-left").addEventListener("click", () => {
      this.handleKeyPress("ArrowLeft");
    });
    document.getElementById("dpad-right").addEventListener("click", () => {
      this.handleKeyPress("ArrowRight");
    });
    document.getElementById("dpad-down").addEventListener("click", () => {
      this.handleKeyPress("ArrowDown");
    });
    document.getElementById("back-button").addEventListener("click", () => {
      this.handleKeyPress("Escape");
    });
    document.getElementById("restart-button").addEventListener("click", () => {
      this.handleKeyPress("InstaRestart");
    });
    document.getElementById("spell-button").addEventListener("click", () => {
      this.handleKeyPress("Space");
    });
    document.getElementById("undo-button").addEventListener("click", () => {
      this.handleKeyPress("KeyZ");
    });
    */

    // Keyboard events
    window.addEventListener("keydown", (e) => {
      // if (!this.keys[e.code]) {
      //   this.keysPressed[e.code] = true; // Single press detection
      // }
      this.keys[e.code] = true;
      if (this.handleKeyPress(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
      // this.keysPressed[e.code] = false;
      e.preventDefault();

      // if (e.code == "KeyR") {
      //   // On R key up, send a dummy input to re-render level
      //   this.handleKeyPress("KeyUp");
      //   this.requestRedraw();
      // }
    });

    // Minimal mouse events (mainly for UI)
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * GAME_WIDTH;
      this.mouse.y = ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT;

      this.hoveredButton = undefined;
      Object.values(this.mouseListeners).forEach((btn) => {
        btn.hovered = false;
        if (
          btn.x <= this.mouse.x &&
          btn.y <= this.mouse.y &&
          btn.x + btn.width >= this.mouse.x &&
          btn.y + btn.height >= this.mouse.y
        ) {
          btn.hovered = true;
          this.hoveredButton = btn;
        }
      });
    });

    this.canvas.addEventListener("click", (e) => {
      // this.handleMouseClick(this.mouse.x, this.mouse.y);
      if (this.hoveredButton) this.hoveredButton.clickCallback(this.mouse);
      else this.exitClickListeners.forEach((cb) => cb());
      console.log(this.mouse);

      e.preventDefault();
    });

    // Prevent context menu
    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Handle window resize
    // window.addEventListener("resize", () => {
    //   this.handleResize();
    // });
  }

  // handleResize() {
  // Optional: implement responsive canvas sizing
  // For now, keep fixed size
  // }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.render(); // Initial render
      console.log("Game started");

      this.preloadImages().then(() => {
        this.assetsPreloaded = true;
        this.renderLoop();
      });

      this.preloadFonts().then(() => {
        this.fontsLoaded = true;
        this.renderLoop();
      });
    }
  }

  renderLoop() {
    if (!this.isRunning) return;
    this.render();
    setTimeout(() => {
      this.renderLoop();
    }, TARGET_RENDER_MS);
  }

  // Handle key presses based on current scene
  handleKeyPress(keyCode) {
    // switch (this.scene) {
    // case "world":
    //   if (!this.worldMap.handleInput(keyCode)) return false;
    //   break;
    // case "zone":
    //   if (!this.zoneMap.handleInput(keyCode)) return false;
    //   break;
    // case "level":
    //   if (!this.levelManager.handleGameInput(keyCode)) return false;
    //   break;
    // case "comic":
    //   if (!this.comic.handleInput(keyCode)) return false;
    //   break;
    // }
    // this.requestRedraw();
  }

  // Handle minimal mouse input (mainly for UI buttons)
  handleMouseClick(x, y) {
    // this.requestRedraw();
  }

  computeIntents() {
    this.intents = {};

    Object.entries(this.keys).forEach(([k, v]) => {
      if(!v) return;
      const mappedKey = this.rebindModal.keyMap[k];
      if(!mappedKey) return;
      const intent = this.rebindModal.binds[mappedKey]
      if(!intent) return;
      this.intents[intent] = true;
    })
  }

  render() {
    if (!this.assetsPreloaded) return;
    if (!this.fontsLoaded) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.computeIntents();

    // Set default styles
    this.ctx.fillStyle = "#fff";
    this.ctx.strokeStyle = "#fff";
    this.ctx.font = "16px Courier New";

    // Render based on current scene
    switch (this.scene) {
      case "level":
        this.levelManager.renderGame(this.ctx);

        // Render modal
        this.rebindModal.render();
        break;
    }
  }

  async loadImage(src) {
    if (this.loadedImages.has(src)) {
      return this.loadedImages.get(src);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedImages.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  // Preload multiple images
  async preloadImages() {
    try {
      await Promise.all(ALL_ASSETS.map((path) => this.loadImage(path)));
      console.log("All images preloaded");
    } catch (error) {
      console.error("Error preloading images:", error);
    }
  }

  async preloadFonts() {
    try {
      await Promise.all(
        FONTS.map(([fontName, weights]) =>
          Promise.all(
            weights.map((weight) =>
              document.fonts.load(`${weight} 12px ${fontName}`),
            ),
          ),
        ),
      );
      console.log("All fonts preloaded");
    } catch (error) {
      console.error("Error preloading fonts:", error);
    }
  }

  // Draw image utility
  drawImage(src, x, y, width = null, height = null, clip = {}) {
    const { x: clipX, y: clipY, width: clipWidth, height: clipHeight } = clip;
    const img = this.loadedImages.get(src);
    if (!img) {
      console.warn(`Image not loaded: ${src}`);
      return;
    }

    if (Object.keys(clip).length > 0) {
      this.ctx.drawImage(
        img,
        clipX,
        clipY,
        clipWidth,
        clipHeight,
        x,
        y,
        width,
        height,
      );
    } else if (width && height) {
      this.ctx.drawImage(img, x, y, width, height);
    } else {
      this.ctx.drawImage(img, x, y);
    }
  }

  // Utility methods

  DRAW_PARAMS = {
    fill: "#fff",
    stroke: "#000",
    strokeWidth: 0,
  };

  getDrawParams(params = {}) {
    const result = {
      ...this.DRAW_PARAMS,
      ...params,
    };

    result.filled = !!result.fill;

    return result;
  }

  drawText(text, x, y, options = {}) {
    const {
      color = "#fff",
      font = "16px Courier New",
      align = "left",
      baseline = "top",
      lineSpacing = Number(font.match(/(\d+)px/)[1] || 16),
    } = options;

    if (typeof text === "object") {
      for (const line of text) {
        y = this.drawText(line, x, y, {
          ...options,
          lineSpacing: lineSpacing,
        });
      }
      return y;
    } else {
      this.ctx.fillStyle = color;
      this.ctx.font = font;
      this.ctx.textAlign = align;
      this.ctx.textBaseline = baseline;
      this.ctx.fillText(text, x, y);

      return y + lineSpacing;
    }
  }

  drawRect(x, y, width, height, params = {}) {
    const { fill, stroke, strokeWidth, filled } = this.getDrawParams(params);

    this.ctx.strokeStyle = stroke;
    this.ctx.fillStyle = fill;
    this.ctx.lineWidth = strokeWidth;

    if (filled) this.ctx.fillRect(x, y, width, height);
    if (strokeWidth) this.ctx.strokeRect(x, y, width, height);
  }

  drawPath(path, params = {}) {
    const { fill, stroke, strokeWidth, filled } = this.getDrawParams(params);

    this.ctx.strokeStyle = stroke;
    this.ctx.fillStyle = fill;
    this.ctx.lineWidth = strokeWidth;

    if (filled) this.ctx.fill(path);
    if (strokeWidth) this.ctx.stroke(path);
  }

  drawCircle(x, y, radius, color = "#fff", filled = true) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;

    if (filled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  // Collision detection utility
  isColliding(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  // Distance calculation
  getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
}

// Initialize and start the game when the page loads
window.addEventListener("load", () => {
  const game = new Game();
  game.start();
});
