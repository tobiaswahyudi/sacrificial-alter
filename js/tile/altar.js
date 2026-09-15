const TILE_TYPE_ALTAR = "altar";

const AltarTile = (r, c) => ({
  type: TILE_TYPE_ALTAR,
  r,
  c,
  render: (game) => {
    game.drawImage(
      ASSETS.SPRITE.ALTAR,
      c * TILE_SIZE,
      r * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE,
    );
  },
});
