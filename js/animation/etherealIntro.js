const ETHEREAL_INTRO_RENDER =
  (frames, img, x, y, width, height, params) => (game, frame) => {
    const { startBlur, startScale, offset = new Position(), ...fillParams } = params;

    const progress = frame / frames;

    const scale = startScale + (1 - startScale) * progress;
    const blur = startBlur * (1 - progress);

    const curWidth = width * scale;
    const curHeight = height * scale;

    game.ctx.save();
    game.ctx.globalAlpha = progress;
    game.ctx.filter = `blur(${blur}px)`;

    if (img == ASSETS.SHAPE.SQUARE) {
      game.drawRect(
        x - curWidth / 2 + offset.x,
        y - curHeight / 2 + offset.y,
        curWidth,
        curHeight,
        fillParams,
      );
    } else {
      game.drawImage(
        img,
        x - curWidth / 2,
        y - curHeight / 2,
        curWidth,
        curHeight,
      );
    }

    game.ctx.restore();
  };

class EtherealIntroAnimation extends GSAnimation {
  // x,y are centered
  constructor(frames, x, y, img, width, height, params = {}) {
    super({
      ...getAnimationOptions(params),
      frames,
      render: ETHEREAL_INTRO_RENDER(frames, img, x, y, width, height, params),
      callback: params?.callback,
    });
  }
}
