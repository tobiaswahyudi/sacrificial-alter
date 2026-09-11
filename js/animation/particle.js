const PARTICLE_RENDER = (img, pos, vel, size, params) => {
  let rotation = randomRange(-2, 2);
  const omega = randomRange(-0.3, 0.3);
  return (game, frame) => {
    const { gravity, shrink } = params;

    vel.x += gravity.x;
    vel.y += gravity.y;

    pos.x += vel.x;
    pos.y += vel.y;

    size -= shrink;

    if (size < 1) return;

    game.ctx.save();
    game.ctx.translate(pos.x, pos.y);
    game.ctx.rotate(rotation);
    rotation += omega;

    game.drawImage(img, -size / 2, -size / 2, size, size);
    game.ctx.restore();
  };
};

class ParticleAnimation extends GSAnimation {
  constructor(frames, pos, vel, img, originalSize, params = {}, callback) {
    const defaultedParams = {
      gravity: new Position(0, 1),
      shrink: 0,
      ...params,
    };

    super({
      frames: frames,
      render: PARTICLE_RENDER(img, pos, vel, originalSize, defaultedParams),
      callback: callback,
      absoluteSize: true,
      ...params,
    });
  }
}
