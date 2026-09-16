const TILE_TYPE_BRAIN = "brain";
const TILE_BRAIN_BOB_TIME_MULT = 0.03;
const TILE_BRAIN_BOB_AMPLITUDE = 0.1 * TILE_SIZE;

const TILE_BRAIN_SCALE = 0.8;
const TILE_BRAIN_OFFSET = (1 - TILE_BRAIN_SCALE) / 2;

const TILE_BRAIN_GLOW_SIZE = 1.2;
const TILE_BRAIN_GLOW_OSC_AMPLITUDE = 0.3 * TILE_SIZE;

const ROTATION_SCALE = 0.01;

const BrainTile = (r, c, srow, scol) => {
  const id = `s(r${srow}c${scol})[${r}][${c}]`;
  return {
    type: TILE_TYPE_BRAIN,
    r,
    c,
    id,
    render: (game) => {
      if (game.gotBrains[id]) return;
      const sinVal = Math.sin(game.frame * TILE_BRAIN_BOB_TIME_MULT);
      const yBob = TILE_BRAIN_BOB_AMPLITUDE * sinVal;
      const glowOsc = TILE_BRAIN_GLOW_OSC_AMPLITUDE * sinVal;

      game.ctx.save();
      game.ctx.globalAlpha = 0.4;

      game.ctx.translate((c + 0.5) * TILE_SIZE, (r + 0.5) * TILE_SIZE + yBob);
      game.ctx.rotate(ROTATION_SCALE * game.frame);

      game.drawImage(
        ASSETS.EFFECTS.GLOW,
        -0.5 * (TILE_BRAIN_GLOW_SIZE * TILE_SIZE + glowOsc),
        -0.5 * (TILE_BRAIN_GLOW_SIZE * TILE_SIZE + glowOsc),
        TILE_SIZE * TILE_BRAIN_GLOW_SIZE + glowOsc,
        TILE_SIZE * TILE_BRAIN_GLOW_SIZE + glowOsc,
      );

      game.ctx.rotate(Math.PI / 6);

      game.drawImage(
        ASSETS.EFFECTS.GLOW,
        -0.5 * (TILE_BRAIN_GLOW_SIZE * TILE_SIZE - glowOsc),
        -0.5 * (TILE_BRAIN_GLOW_SIZE * TILE_SIZE - glowOsc),
        TILE_SIZE * TILE_BRAIN_GLOW_SIZE - glowOsc,
        TILE_SIZE * TILE_BRAIN_GLOW_SIZE - glowOsc,
      );

      game.ctx.restore();

      game.drawImage(
        ASSETS.SPRITE.BRAIN,
        (c + TILE_BRAIN_OFFSET) * TILE_SIZE,
        (r + TILE_BRAIN_OFFSET) * TILE_SIZE + yBob,
        TILE_SIZE * TILE_BRAIN_SCALE,
        TILE_SIZE * TILE_BRAIN_SCALE,
      );
    },
  };
};
