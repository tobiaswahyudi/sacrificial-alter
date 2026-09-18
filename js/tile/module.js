const TILE_TYPE_MODULE = "module";
const TILE_MODULE_BOB_TIME_MULT = 0.03;
const TILE_MODULE_BOB_AMPLITUDE = 0.1 * TILE_SIZE;

const TILE_MODULE_SCALE = 0.8;
const TILE_MODULE_OFFSET = (1 - TILE_MODULE_SCALE) / 2;

const TILE_MODULE_GLOW_SIZE = 1.2;
const TILE_MODULE_GLOW_OSC_AMPLITUDE = 0.3 * TILE_SIZE;

// reused from brain
// const ROTATION_SCALE = 0.01;

const ModuleTile = (r, c, srow, scol) => {
  // Index OF the screen
  let idScreenRow = srow
  let idScreenCol = scol
  // Index of the module IN the screen
  let idRow = r
  let idCol = c

  if(idRow == 0) {
    idRow = TILE_ROWS;
    idScreenRow--;
  }
  if(idRow == TILE_ROWS + 1) {
    idRow = 1;
    idScreenRow++;
  }

  if(idCol == 0) {
    idCol = TILE_COLS;
    idScreenCol--;
  }
  if(idCol == TILE_COLS+ 1) {
    idCol = 1;
    idScreenCol++;
  }

  const id = `s(r${idScreenRow},c${idScreenCol})[${idRow}][${idCol}]`;
  console.log(id)
  return {
    type: TILE_TYPE_MODULE,
    r,
    c,
    id,
    render: (game) => {
      if (game.gotModules[id]) return;
      const sinVal = Math.sin(game.frame * TILE_MODULE_BOB_TIME_MULT);
      const yBob = TILE_MODULE_BOB_AMPLITUDE * sinVal;
      const glowOsc = TILE_MODULE_GLOW_OSC_AMPLITUDE * sinVal;

      game.ctx.save();
      game.ctx.globalAlpha = 0.1;

      game.ctx.translate((c + 0.5) * TILE_SIZE, (r + 0.5) * TILE_SIZE + yBob);
      game.ctx.rotate(ROTATION_SCALE * game.frame);

      game.drawImage(
        ASSETS.EFFECTS.GLOW,
        -0.5 * (TILE_MODULE_GLOW_SIZE * TILE_SIZE + glowOsc),
        -0.5 * (TILE_MODULE_GLOW_SIZE * TILE_SIZE + glowOsc),
        TILE_SIZE * TILE_MODULE_GLOW_SIZE + glowOsc,
        TILE_SIZE * TILE_MODULE_GLOW_SIZE + glowOsc,
      );

      game.ctx.rotate(Math.PI / 6);

      game.drawImage(
        ASSETS.EFFECTS.GLOW,
        -0.5 * (TILE_MODULE_GLOW_SIZE * TILE_SIZE - glowOsc),
        -0.5 * (TILE_MODULE_GLOW_SIZE * TILE_SIZE - glowOsc),
        TILE_SIZE * TILE_MODULE_GLOW_SIZE - glowOsc,
        TILE_SIZE * TILE_MODULE_GLOW_SIZE - glowOsc,
      );

      game.ctx.restore();

      game.drawImage(
        ASSETS.SPRITE.MODULE,
        (c + TILE_MODULE_OFFSET) * TILE_SIZE,
        (r + TILE_MODULE_OFFSET) * TILE_SIZE + yBob,
        TILE_SIZE * TILE_MODULE_SCALE,
        TILE_SIZE * TILE_MODULE_SCALE,
      );
    },
  };
};
