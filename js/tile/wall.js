const TILE_TYPE_WALL = "wall";

const WallTile = (r, c) => ({
  type: TILE_TYPE_WALL,
  r,
  c,
  render: (game) => {
    game.drawRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE, {
      fill: "#220803",
    });
  },
});
