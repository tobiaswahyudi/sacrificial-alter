const TRANSITION_FRAMES = 20;

const TRANSITION_DIRECTION = {
  IN: "in",
  OUT: "out",
};

const TRANSITION_RENDER = (frames, direction, color, ww, hh, cc) => (game, frame) => {
  // Easier to read than defaults
  const width = ww || BOARD_SIZE;
  const height = hh || BOARD_SIZE;
  const bs = BOARD_SIZE / 2 + BOARD_PADDING;
  const center = cc || new Position(bs, bs);
  const progress =
    direction === TRANSITION_DIRECTION.OUT
      ? 1 - frame / frames
      : frame / frames;

  const maxRadius = Math.hypot(width, height);
  const radius = maxRadius * progress;

  const vignette = new Path2D();

  const L = center.x - width / 2;
  const R = L + width;
  const U = center.y - height / 2;
  const D = U + height;

  vignette.arc(center.x, center.y, radius, 0, Math.PI * 2);
  vignette.lineTo(R, center.y);
  vignette.lineTo(R, D);
  vignette.lineTo(L, D);
  vignette.lineTo(L, U);
  vignette.lineTo(R, U);
  vignette.lineTo(R, center.y);
  vignette.closePath();

  game.ctx.save();
  game.ctx.clip(vignette, "evenodd");
  game.ctx.globalAlpha = 1 - 0.6 * progress;
  game.drawRect(L, U, width, height, {
    fill: color,
  });
  game.ctx.restore();
};

class TransitionAnimation extends GSAnimation {
  constructor(direction = TRANSITION_DIRECTION.IN, options, callback) {
    const frames = options?.frames || TRANSITION_FRAMES;
    super({
      frames: frames,
      render: TRANSITION_RENDER(
        frames,
        direction,
        options?.color || '#BDAFA1',
        options?.width,
        options?.height,
        options?.center,
      ),
      callback: callback,
      blocksInput: true,
      absoluteSize: true,
    });
    this.direction = direction;
    this.name = direction + this.name;
  }
}
