const REBIND_WIDTH = 400;
const REBIND_HEIGHT = 320;

const REBIND_LEFT = (GAME_WIDTH - REBIND_WIDTH) / 2;
const REBIND_TOP = (GAME_HEIGHT - REBIND_HEIGHT) / 2;

const REBIND_TOP_LEFT = new Position(REBIND_LEFT, REBIND_TOP);

const Intent = {
  RIGHT: "right",
  LEFT: "left",
  JUMP: "jump",
};

const MappedKey = {
  RIGHT: "d",
  LEFT: "a",
  JUMP: "w",
};

const intentButtonDrawParams = {
  font: "700 10px monospace",
  fontSize: 10,
  fill: "#643c3b",
  stroke: "#532d2c",
};
const intentButtonHoverParams = {
  font: "700 10px monospace",
  fontSize: 10,
};

let MAPPED_KEYS_UNLOCKABLE = [
  {
    key: MappedKey.JUMP,
    obj: {
      x: 0,
      y: -40,
      text: "W",
    },
  },
];

const REBIND_MAPPED_KEYS_DISPLAY_CENTER = new Position(
  REBIND_LEFT + 72,
  REBIND_TOP + 128,
);

class RebindModal {
  constructor(game) {
    this.game = game;
    this.animations = new AnimationManager(game, this.state);
    this.modal = undefined;
    this.open = false;

    this.selection = undefined;

    this.mappedKeyButtonParams = {
      [MappedKey.LEFT]: {
        x: -36,
        y: 0,
        text: "A",
      },
      [MappedKey.RIGHT]: {
        x: 32,
        y: 0,
        text: "D",
      },
    };

    // Attach clear listener
    this.game.exitClickListeners.push(() => {
      this.selection = undefined;
    });

    this.intentButtonParams = {
      [Intent.RIGHT]: {
        x: 410,
        width: 64,
        y: 185,
        height: 24,
        text: "go right",
      },
      [Intent.LEFT]: { x: 410, width: 64, y: 245, height: 24, text: "go left" },
      [Intent.JUMP]: { x: 360, width: 48, y: 215, height: 24, text: "jump" },
    };

    const makeIntentButton = ([key, btn]) => {
      return new Button(game, {
        x: btn.x,
        width: btn.width,
        y: btn.y,
        height: btn.height,
        text: btn.text,
        clickCallback: () => {
          if (this.selection) {
            // console.log(this.selection, key);
            this.binds[this.selection] = key;
            this.selection = undefined;
          }
        },
        drawParams: intentButtonDrawParams,
        hoverParams: intentButtonHoverParams,
      });
    };

    this.buttons = [
      new Button(game, {
        x: REBIND_LEFT + 130,
        width: 140,
        y: REBIND_TOP + 280,
        height: 32,
        text: "I AM PERFECT",
        clickCallback: () => {
          this.open = false;
        },
      }),
      ...Object.entries(this.intentButtonParams).map(makeIntentButton),
    ];

    (Object.entries(this.mappedKeyButtonParams).forEach(
      this.makeMapKeyButton.bind(this),
    ),
      (this.keyMap = {
        ArrowUp: MappedKey.JUMP,
        KeyW: MappedKey.JUMP,
        Space: MappedKey.JUMP,
        ArrowRight: MappedKey.RIGHT,
        KeyD: MappedKey.RIGHT,
        ArrowLeft: MappedKey.LEFT,
        KeyA: MappedKey.LEFT,
      }));

    this.waypoints = {
      [MappedKey.JUMP]: new Position(280, 200),
      [MappedKey.RIGHT]: new Position(280, 208),
      [MappedKey.LEFT]: new Position(280, 216),
    };

    this.binds = {
      [MappedKey.RIGHT]: Intent.RIGHT,
      [MappedKey.LEFT]: Intent.LEFT,
      // [MappedKey.JUMP]: Intent.JUMP,
    };
  }

  makeMapKeyButton([key, btn]) {
    const button = new Button(this.game, {
      x: btn.x - 16 + REBIND_MAPPED_KEYS_DISPLAY_CENTER.x,
      width: 32,
      y: btn.y - 16 + REBIND_MAPPED_KEYS_DISPLAY_CENTER.y,
      height: 32,
      text: btn.text,
      clickCallback: () => {
        this.selection = key;
      },
    });

    this.buttons.push(button);
  }

  remakeButtons() {}

  show() {
    this.open = true;
  }

  close() {
    this.open = false;
  }

  render() {
    if (!this.open) return;

    // Game area background
    this.game.drawRect(REBIND_LEFT, REBIND_TOP, REBIND_WIDTH, REBIND_HEIGHT, {
      fill: "#4f2422",
      stroke: "#33100e",
      strokeWidth: 4,
    });

    this.game.drawImage(ASSETS.UI.KEYBOARD, REBIND_LEFT + 8, REBIND_TOP + 64);
    this.game.drawImage(
      ASSETS.UI.ANATOMY,
      REBIND_LEFT + 8 + 128,
      REBIND_TOP + 64,
    );

    Object.entries(this.binds).forEach(([mk, i], idx) => {
      if (mk == this.selection) return;
      const mkPos = REBIND_MAPPED_KEYS_DISPLAY_CENTER.add(
        this.mappedKeyButtonParams[mk],
      );
      const waypoint = this.waypoints[mk];
      const iPos = this.intentButtonParams[i];

      const line = new Path2D();
      line.moveTo(mkPos.x, mkPos.y);
      line.lineTo(waypoint.x, waypoint.y);
      line.lineTo(iPos.x + iPos.width / 2, iPos.y + iPos.height / 2);

      this.game.drawPath(line, {
        stroke: `hsl(${20 + idx * 20}, 100%, 50%)`,
        strokeWidth: 1,
        filled: false,
        fill: undefined,
      });
    });

    this.buttons.forEach((btn) => btn.render());
    
    if (this.selection) {
      const mkPos = REBIND_MAPPED_KEYS_DISPLAY_CENTER.add(
        this.mappedKeyButtonParams[this.selection],
      );

      const line = new Path2D();
      line.moveTo(mkPos.x, mkPos.y);
      line.lineTo(this.game.mouse.x, this.game.mouse.y);

      this.game.drawPath(line, {
        stroke: `hsl(0, 100%, 50%)`,
        strokeWidth: 3,
        filled: false,
        fill: undefined,
      });
    }

  }
}
