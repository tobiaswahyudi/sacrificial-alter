const COLORFADE_RENDER =
  (inFrames, holdFrames, outFrames, color = "#BDAFA1") =>
  (game, frame) => {
    let progress = 0;

    if (frame > inFrames + holdFrames) {
      // fade out
      const curFrame = frame - inFrames - holdFrames;
      progress = 1 - curFrame / outFrames;
    } else if (frame > inFrames) {
      // hold
      progress = 1;
    } else {
      // fade in
      progress = frame / inFrames;
    }

    game.ctx.save();
    game.ctx.globalAlpha = progress;
    game.drawRect(0, 0, game.width, game.height, {
      fill: color,
      globalAlpha: progress,
    });
    game.ctx.restore();
  };

class ColorFadeAnimation extends GSAnimation {
  constructor(inFrames, holdFrames, outFrames, color = "#BDAFA1", callback) {
    super({
      frames: inFrames + holdFrames + outFrames,
      render: COLORFADE_RENDER(inFrames, holdFrames, outFrames, color),
      callback: callback,
      blocksInput: true,
    });
  }
}
