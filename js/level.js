const TILE_MAP = {
  "#": WallTile,
};

const PLAYER_WIDTH = 0.65;
const PLAYER_LEFT = (1 - PLAYER_WIDTH) * 0.5;

const PLAYER_TOP = 0.3;
const PLAYER_HEIGHT = 0.6;
const PLAYER_BOTTOM = 1 - PLAYER_TOP - PLAYER_HEIGHT;

const PLAYER_TOP_LEFT = new Position(PLAYER_LEFT, PLAYER_TOP).scale(TILE_SIZE);

const PLAYER_CENTER = new Position(PLAYER_LEFT, PLAYER_TOP)
  .m_add(new Position(PLAYER_WIDTH, PLAYER_HEIGHT).scale(0.5))
  .scale(TILE_SIZE);

const MOVE_ACCEL = 0.1;
const MOVE_SPEED = 2;
const MAX_FALL_SPEED = 6.4;

const GRAVITY = 0.15;

const JUMP_SPEED = 5;

const EPSILON = 1;

const SCREEN_TRANSITION_NUDGE = 4;

const PLAYER_COLLISION_CHECKPOINT_BEHIND = -0.4;
const PLAYER_COLLISION_CHECKPOINT_AFTER = 1.4;
const PLAYER_COLLISION_CHECKPOINT_NEAR = 0.2;
const PLAYER_COLLISION_CHECKPOINT_FAR = 0.8;

const PLAYER_FEET_CHECKPOINTS = [
  new Position(
    PLAYER_COLLISION_CHECKPOINT_NEAR,
    PLAYER_COLLISION_CHECKPOINT_AFTER,
  ),
  new Position(
    PLAYER_COLLISION_CHECKPOINT_FAR,
    PLAYER_COLLISION_CHECKPOINT_AFTER,
  ),
];

const PLAYER_HEAD_CHECKPOINTS = [
  new Position(
    PLAYER_COLLISION_CHECKPOINT_NEAR,
    PLAYER_COLLISION_CHECKPOINT_BEHIND,
  ),
  new Position(
    PLAYER_COLLISION_CHECKPOINT_FAR,
    PLAYER_COLLISION_CHECKPOINT_BEHIND,
  ),
];

const PLAYER_LEFT_CHECKPOINTS = [
  new Position(
    PLAYER_COLLISION_CHECKPOINT_BEHIND,
    PLAYER_COLLISION_CHECKPOINT_NEAR,
  ),
  new Position(
    PLAYER_COLLISION_CHECKPOINT_BEHIND,
    PLAYER_COLLISION_CHECKPOINT_FAR,
  ),
];

const PLAYER_RIGHT_CHECKPOINTS = [
  new Position(
    PLAYER_COLLISION_CHECKPOINT_AFTER,
    PLAYER_COLLISION_CHECKPOINT_NEAR,
  ),
  new Position(
    PLAYER_COLLISION_CHECKPOINT_AFTER,
    PLAYER_COLLISION_CHECKPOINT_FAR,
  ),
];

class LevelManager {
  constructor(game, playerPos, titleString, srow, scol) {
    this.game = game;
    this.titleString = titleString;

    this.player = playerPos.scale(TILE_SIZE);
    this.playerVel = new Position(0, 0);
    this.onGround = false;

    this.animations = new AnimationManager(game, this.state);
    this.juiceOffset = new Position(0, 0);

    this.altarPopup = undefined;

    this.transitionToLevel(srow, scol);
  }

  transitionToLevel(srow, scol) {
    this.map = [];
    this.tiles = [];
    this.srow = srow;
    this.scol = scol;

    // add corners and edges into map screen
    let ul = this.game.world.get(srow - 1, scol - 1);
    let um = this.game.world.get(srow - 1, scol + 0);
    let ur = this.game.world.get(srow - 1, scol + 1);
    let ml = this.game.world.get(srow + 0, scol - 1);
    let mr = this.game.world.get(srow + 0, scol + 1);
    let dl = this.game.world.get(srow + 1, scol - 1);
    let dm = this.game.world.get(srow + 1, scol + 0);
    let dr = this.game.world.get(srow + 1, scol + 1);

    // If not found, put walls
    const DEFAULT_TILE = "#";

    const emptyRow = new Array(TILE_COLS).fill(DEFAULT_TILE);
    const emptyCol = new Array(TILE_ROWS).fill(DEFAULT_TILE);

    ul = last(last(ul)) || DEFAULT_TILE;
    um = last(um) || [...emptyRow];
    ur = first(last(ur)) || DEFAULT_TILE;
    ml = ml?.map((c) => last(c)) || [...emptyCol];
    mr = mr?.map((c) => first(c)) || [...emptyCol];
    dl = last(first(dl)) || DEFAULT_TILE;
    dm = first(dm) || [...emptyRow];
    dr = first(first(dr)) || DEFAULT_TILE;

    this.map = this.game.world
      .get(srow, scol)
      .map((line, idx) => [ml[idx], ...line, mr[idx]]);
    const u = [ul, ...um, ur];
    const d = [dl, ...dm, dr];
    this.map = [u, ...this.map, d];

    // Iterate tiles
    for (let r = 0; r < TILE_ROWS + 2; r++) {
      for (let c = 0; c < TILE_COLS + 2; c++) {
        const tile = this.map[r][c];
        switch (tile) {
          case "#": {
            this.tiles.push(WallTile(r, c));
            break;
          }
          case "@": {
            this.tiles.push(AltarTile(r, c));
            break;
          }
        }
      }
    }
  }

  applyGravity() {
    this.playerVel.y += GRAVITY;
    this.playerVel.y = Math.min(this.playerVel.y, MAX_FALL_SPEED);
  }

  getRowCol(pt) {
    const row = Math.floor(pt.y / TILE_SIZE);
    const col = Math.floor(pt.x / TILE_SIZE);
    return [row, col];
  }

  checkTileAtPoint([row, col]) {
    return this.map[row]?.[col];
  }

  checkSide(points, direction, limiter, offset, debugColor) {
    // Assumption on limiter & points, so that arbitrary .find selection behavior still gives same limiter result.
    const wall = points
      .map(this.getRowCol)
      .find((x) => this.checkTileAtPoint(x) == "#");

    if (!wall) return;
    limiter(wall, direction, offset, debugColor);
  }

  limit([row, col], dir, offset, debugColor) {
    if (debugColor)
      drawSurface(this.game, row, col, oppositeDirection(dir), debugColor);
    switch (dir) {
      case Direction.LEFT: {
        this.player.x = Math.max(this.player.x, surfaceRight(col) - offset);
        break;
      }
      case Direction.RIGHT: {
        this.player.x = Math.min(this.player.x, surfaceLeft(col) - offset);
        break;
      }
      case Direction.UP: {
        this.player.y = Math.max(this.player.y, surfaceBottom(row) - offset);
        this.playerVel.y = Math.max(this.playerVel.y, 0);
        break;
      }
      case Direction.DOWN: {
        const topLimit = surfaceTop(row) - offset;
        if (this.player.y > topLimit) {
          this.player.y = topLimit;
          if (this.playerVel.y >= 0) {
            // console.log("grounded");
            this.onGround = true;
          }
          this.playerVel.y = 0;
        }
        break;
      }
    }
  }

  // Level Input Handling
  applyInput() {
    if (this.game.rebindModal.open) return;

    // Jump
    if (this.game.intents[Intent.JUMP] && this.onGround) {
      this.playerVel.y = -JUMP_SPEED;
      this.onGround = false;
    }

    // Horizontal
    if (this.game.intents[Intent.RIGHT]) {
      // If going opposite way, decay and then add speed
      if(this.playerVel.x < 0) this.playerVel.x *= 0.5;
      this.playerVel.x += MOVE_ACCEL;
    } else if (this.game.intents[Intent.LEFT]) {
      // If going opposite way, decay and then add speed
      if(this.playerVel.x > 0) this.playerVel.x *= 0.5;
      this.playerVel.x -= MOVE_ACCEL;
    } else {
      this.playerVel.x *= 0.5;
    }

    // Interact
    if (this.game.keys["KeyE"] && this.altarPopup) {
      this.game.rebindModal.show();
    }

    this.playerVel.x = clamp(this.playerVel.x, -MOVE_SPEED, MOVE_SPEED);
  }

  applyVelocity() {
    this.player.m_add(this.playerVel);
  }

  renderAltarPopup(hMid, vMid) {
    return () => {
      this.game.drawText("USE THE ALTAR", hMid, vMid - 12 - 16, {
        color: "#ce1b1b",
        font: "500 14px Alkhemikal",
        align: "center",
      });

      this.game.drawText("UNBIND THYSELF", hMid, vMid - 12, {
        color: "#ce1b1b",
        font: "500 18px Alkhemikal",
        align: "center",
      });
      this.game.drawText("[E]", hMid, vMid - 12 + 24, {
        color: "#ce1b1b",
        font: "700 18px monospace",
        align: "center",
      });
    };
  }

  // Level Rendering
  renderGame() {
    const { width, height } = this.game;
    const [pRow, pCol] = this.getRowCol(this.player.add(PLAYER_CENTER));

    this.applyGravity();
    this.applyInput();
    this.applyVelocity();
    // this.applyWallCollisions();

    // Game area background
    this.game.drawRect(0, 0, width, height, { fill: "#521d1d" });

    // Tiles
    this.tiles.forEach((tile) => {
      switch (tile.type) {
        case TILE_TYPE_WALL: {
          this.game.drawRect(
            tile.c * TILE_SIZE,
            tile.r * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
            {
              fill: "#241308",
            },
          );
          break;
        }
        case TILE_TYPE_ALTAR: {
          this.game.drawImage(
            ASSETS.SPRITE.ALTAR,
            tile.c * TILE_SIZE,
            tile.r * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
          );
          break;
        }
      }
    });

    // Draw animations behind tiles & stuff
    this.animations.tick();

    this.game.drawImage(
      ASSETS.SPRITE.GOLEM,
      this.player.x,
      this.player.y,
      TILE_SIZE,
      TILE_SIZE,
    );

    // Check Tile Interactions
    const currentTile = this.tiles.find((t) => t.r == pRow && t.c == pCol);
    if (currentTile?.type == TILE_TYPE_ALTAR) {
      // Draw Nineslice
      if (!this.altarPopup) {
        const hMid = (pCol + 0.5) * TILE_SIZE;
        const vMid = (pRow - 2) * TILE_SIZE;
        this.altarPopup = new PopupAnimation(
          112,
          32,
          hMid,
          vMid,
          false,
          this.renderAltarPopup(hMid, vMid),
          THUNK,
          {
            blocksInput: false,
          },
        );
        this.animations.push(this.altarPopup);
      }
    } else {
      if (this.altarPopup) {
        this.altarPopup.needsInput = false;
        this.altarPopup = undefined;
      }
    }

    // Draw checkpointers
    const PLAYER_ACTUAL_TOP_RIGHT = this.player.add(PLAYER_TOP_LEFT);
    const checkpointToWorldSpace = (pt) =>
      pt
        .clone()
        .scale(PLAYER_WIDTH, PLAYER_HEIGHT)
        .scale(TILE_SIZE)
        .add(PLAYER_ACTUAL_TOP_RIGHT);

    // const renderCheckpoints = (color, pts) => {
    //   pts.forEach((pt) => {
    //     const loc = checkpointToWorldSpace(pt);
    //     this.game.drawCircle(loc.x, loc.y, 2, color, true);
    //   });
    // };

    // renderCheckpoints("#f8f813", PLAYER_FEET_CHECKPOINTS);
    this.checkSide(
      PLAYER_FEET_CHECKPOINTS.map(checkpointToWorldSpace),
      Direction.DOWN,
      this.limit.bind(this),
      (1 - PLAYER_BOTTOM) * TILE_SIZE,
      // "#f8f813",
    );

    // renderCheckpoints("#13f82a", PLAYER_HEAD_CHECKPOINTS);
    this.checkSide(
      PLAYER_HEAD_CHECKPOINTS.map(checkpointToWorldSpace),
      Direction.UP,
      this.limit.bind(this),
      PLAYER_TOP * TILE_SIZE,
      // "#13f82a",
    );

    // renderCheckpoints("#1326f8", PLAYER_LEFT_CHECKPOINTS);
    this.checkSide(
      PLAYER_LEFT_CHECKPOINTS.map(checkpointToWorldSpace),
      Direction.LEFT,
      this.limit.bind(this),
      PLAYER_LEFT * TILE_SIZE,
      // "#1326f8",
    );

    // renderCheckpoints("#f8138d", PLAYER_RIGHT_CHECKPOINTS);
    this.checkSide(
      PLAYER_RIGHT_CHECKPOINTS.map(checkpointToWorldSpace),
      Direction.RIGHT,
      this.limit.bind(this),
      (1 - PLAYER_LEFT) * TILE_SIZE,
      // "#f8138d",
    );

    // Check transition
    // Remember there are 2 extra rows and cols on the border.
    if (pCol == TILE_COLS + 1) {
      this.player.x -= TILE_COLS * TILE_SIZE - SCREEN_TRANSITION_NUDGE;
      this.transitionToLevel(this.srow, this.scol + 1);
    } else if (pCol == 0) {
      this.player.x += TILE_COLS * TILE_SIZE - SCREEN_TRANSITION_NUDGE;
      this.transitionToLevel(this.srow, this.scol - 1);
    }

    if (pRow == TILE_ROWS + 1) {
      this.player.y -= TILE_ROWS * TILE_SIZE - SCREEN_TRANSITION_NUDGE;
      this.transitionToLevel(this.srow + 1, this.scol);
    } else if (pRow == 0) {
      this.player.y += TILE_ROWS * TILE_SIZE - SCREEN_TRANSITION_NUDGE;
      this.transitionToLevel(this.srow - 1, this.scol);
    }
  }
}
