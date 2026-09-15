const TILE_TYPE_SIGN = "sign";

const SignTile = (r, c, text = "") => ({
  type: TILE_TYPE_SIGN,
  r,
  c,
  text,
  render: (game) => {
    game.drawImage(
      ASSETS.SPRITE.SIGN,
      c * TILE_SIZE,
      r * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE,
    );
  },
});
