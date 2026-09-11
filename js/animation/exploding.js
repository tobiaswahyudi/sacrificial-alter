const EXPLOSION_FRAMES = 6;

const EXPLOSION_RENDER = (x, y, size, juice) => (game, frame) => {
  const picFrame = Math.floor(frame / 2);
  game.drawImage(
    ASSETS.SPRITE.EXPLOSION,
    x - size / 2,
    y - size / 2,
    size,
    size,
    {
      x: 32 * (picFrame % 4),
      y: 0,
      width: 32,
      height: 32,
    },
  );
};

class ExplosionAnimation extends GSAnimation {
  constructor(x, y, size, juice) {
    super({
      frames: EXPLOSION_FRAMES,
      render: EXPLOSION_RENDER(x, y, size, juice),
    });
  }
}
