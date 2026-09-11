const THUNK = () => {};

const Direction = {
  UP: "u",
  DOWN: "d",
  LEFT: "l",
  RIGHT: "r",
  SLEEP: "s",
};

const oppositeDirection = (direction) => {
  switch (direction) {
    case Direction.UP:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.UP;
    case Direction.LEFT:
      return Direction.RIGHT;
    case Direction.RIGHT:
      return Direction.LEFT;
  }
  return direction;
};

function getDirVec(direction) {
  switch (direction) {
    case Direction.UP:
      return [0, -1];
      break;
    case Direction.DOWN:
      return [0, 1];
      break;
    case Direction.LEFT:
      return [-1, 0];
      break;
    case Direction.RIGHT:
      return [1, 0];
      break;
  }
  return [0, 0];
}

const isOutOfBounds = (size, x, y) => {
  return x < 0 || x >= size || y < 0 || y >= size;
};

const strPosition = (x, y) => `${x},${y}`;

class Position {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return strPosition(this.x, this.y);
  }

  clone() {
    return new Position(this.x, this.y);
  }

  add(other) {
    if (!other) return this.clone();
    return new Position(this.x + other.x, this.y + other.y);
  }

  negate() {
    return this.clone().scale(-1);
  }

  zero() {
    this.x = 0;
    this.y = 0;
    return this;
  }

  randomize() {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    return this;
  }

  normalize() {
    const len = Math.hypot(this.x, this.y);
    this.x /= len;
    this.y /= len;
    return this;
  }

  scale(factor) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }
}
