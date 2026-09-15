const TILE_TYPE_BRAIN = "brain";
const TILE_BRAIN_BOB_TIME_MULT = 0.03;
const TILE_BRAIN_BOB_AMPLITUDE = 0.1 * TILE_SIZE;

const TILE_BRAIN_SCALE = 0.8;
const TILE_BRAIN_OFFSET = (1 - TILE_BRAIN_SCALE) / 2;

const BrainTile = (r, c, srow, scol) => ({
  type: TILE_TYPE_BRAIN,
  r,
  c,
  id: `s(r${srow}c${scol})[${r}][${c}]`,
  render: (game) => {
    const yBob =
      TILE_BRAIN_BOB_AMPLITUDE *
      Math.sin(game.frame * TILE_BRAIN_BOB_TIME_MULT);

    game.drawImage(
      ASSETS.SPRITE.BRAIN,
      (c + TILE_BRAIN_OFFSET) * TILE_SIZE,
      (r + TILE_BRAIN_OFFSET) * TILE_SIZE + yBob,
      TILE_SIZE * TILE_BRAIN_SCALE,
      TILE_SIZE * TILE_BRAIN_SCALE,
    );
  },
});
