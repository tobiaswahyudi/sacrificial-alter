const TILE_MAP = {
  "#": WallTile,
};

class LevelManager {
  constructor(game, playerPos, titleString, srow, scol) {
    this.game = game;
    this.titleString = titleString;
    this.srow = srow;
    this.scol = scol;

    this.player = playerPos;

    this.map = [];

    this.animations = new AnimationManager(game, this.state);

    this.juiceOffset = new Position(0, 0);

    this.tiles = [];
    this.parse();
  }

  parse() {
    const srow = this.srow;
    const scol = this.scol;

    // add corners and edges into map screen
    let ul = this.game.world.get(srow - 1, scol - 1);
    let um = this.game.world.get(srow - 1, scol + 0);
    let ur = this.game.world.get(srow - 1, scol + 1);
    let ml = this.game.world.get(srow + 0, scol - 1);
    let mr = this.game.world.get(srow + 0, scol + 1);
    let dl = this.game.world.get(srow + 1, scol - 1);
    let dm = this.game.world.get(srow + 1, scol + 0);
    let dr = this.game.world.get(srow + 1, scol + 1);

    const emptyRow = new Array(TILE_COLS).fill(".");
    const emptyCol = new Array(TILE_ROWS).fill(".");

    ul = last(last(ul)) || ".";
    um = last(um) || [...emptyRow];
    ur = first(last(ur)) || ".";
    ml = ml?.map((c) => last(c)) || [...emptyCol];
    mr = mr?.map((c) => first(c)) || [...emptyCol];
    dl = last(first(dl)) || ".";
    dm = first(dm) || [...emptyRow];
    dr = first(first(dr)) || ".";

    this.map = this.game.world
      .get(srow, scol)
      .map((line, idx) => [ml[idx], ...line, mr[idx]]);
    const u = [ul, ...um, ur];
    const d = [dl, ...dm, dr];
    this.map = [u, ...this.map, d];

    // Iterate tiles
    for (let r = 0; r < TILE_ROWS + 2; r++) {
      for (let c = 0; c < TILE_ROWS + 2; c++) {
        const tile = this.map[r][c];
        switch (tile) {
          case "#": {
            this.tiles.push(WallTile(r, c));
            break;
          }
        }
      }
    }
  }

  get playerBounds() {
    return [this.player.scale(TILE_SIZE), this.player.scale(TILE_SIZE).add(
      new Position(TILE_SIZE, TILE_SIZE))
    ];
  }

  applyGravity() {
    // Check if player is standing on anything
  }

  // Level Input Handling
  handleGameInput(keyCode) {
    switch (keyCode) {
      case "ArrowUp":
      case "KeyW":
        this.history.copyTop();
        if (!this.makeMove(Direction.UP)) this.history.pop();
        return true;
        break;
      case "ArrowDown":
      case "KeyS":
        this.history.copyTop();
        if (!this.makeMove(Direction.DOWN)) this.history.pop();
        return true;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.history.copyTop();
        if (!this.makeMove(Direction.LEFT)) this.history.pop();
        return true;
        break;
      case "ArrowRight":
      case "KeyD":
        this.history.copyTop();
        if (!this.makeMove(Direction.RIGHT)) this.history.pop();
        return true;
        break;
      case "Space":
        this.history.copyTop();
        if (!this.handleAction()) this.history.pop();
        return true;
        break;
      // case "Escape":
      //   this.game.gameState.level = "selection";
      //   return true;
      case "KeyR":
        // this.history.pop();
        this.handleRestartHold();
        return true;
      case "KeyZ":
        // this.history.pop();
        this.history.pop();
        return true;
      case "Escape":
        this.returnToZone(false);
        return true;
        break;
      case "InstaRestart":
        this.restartLevel();
        return this.handleGameInput("KeyUp");
        break;
      default:
        // this.history.pop();
        return false;
    }
  }

  // Level Rendering
  renderGame() {
    const { width, height } = this.game;

    // Game area background
    this.game.drawRect(0, 0, width, height, { fill: "#4b0f0f" });

    // Tiles
    this.tiles.forEach((tile) => {
      if (tile.type == "wall") {
        this.game.drawRect(
          tile.c * TILE_SIZE,
          tile.r * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          {
            fill: "#241308",
          },
        );
      }
    });

    this.game.drawImage(
      ASSETS.SPRITE.GOLEM,
      this.player.x * TILE_SIZE,
      this.player.y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE,
    );

    playerBounds

    this.game.drawImage(
      ASSETS.SPRITE.GOLEM,
      this.player.x * TILE_SIZE,
      this.player.y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE,
    );
  }
}
