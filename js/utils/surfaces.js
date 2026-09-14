function surfaceTop(row) {
  return row * TILE_SIZE;
}

function surfaceBottom(row) {
  return (row + 1) * TILE_SIZE;
}

function surfaceLeft(col) {
  return col * TILE_SIZE;
}

function surfaceRight(col) {
  return (col + 1) * TILE_SIZE;
}

/**
 * @param {Game} game
 * @param {number} row
 * @param {number} col
 * @param {Direction} dir
 */
function drawSurface(game, row, col, dir, color) {
  const top = surfaceTop(row);
  const bottom = surfaceBottom(row);
  const left = surfaceLeft(col);
  const right = surfaceRight(col);

  switch (dir) {
    case Direction.UP: {
      game.drawRect(left, top, TILE_SIZE, 4, {
        stroke: color,
        strokeWidth: 1,
        fill: undefined,
        filled: false,
      });
      break;
    }
    case Direction.LEFT: {
      game.drawRect(left, top, 4, TILE_SIZE, {
        stroke: color,
        strokeWidth: 1,
        fill: undefined,
        filled: false,
      });
      break;
    }
    case Direction.RIGHT: {
      game.drawRect(right - 4, top, 4, TILE_SIZE, {
        stroke: color,
        strokeWidth: 1,
        fill: undefined,
        filled: false,
      });
      break;
    }
    case Direction.DOWN: {
      game.drawRect(left, bottom - 4, TILE_SIZE, 4, {
        stroke: color,
        strokeWidth: 1,
        fill: undefined,
        filled: false,
      });
      break;
    }
  }
}
