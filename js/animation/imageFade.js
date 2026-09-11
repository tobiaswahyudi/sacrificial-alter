const IMAGEFADE_RENDER =
  (inFrames, holdFrames, outFrames, image, position, width, height) =>
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
    game.drawImage(image, position.x, position.y, width, height);
    game.ctx.restore();
  };

class ImageFadeAnimation extends GSAnimation {
  constructor(inFrames, holdFrames, outFrames, image, position, width, height, callback) {
    super({
      frames: inFrames + holdFrames + outFrames,
      render: IMAGEFADE_RENDER(inFrames, holdFrames, outFrames, image, position, width, height),
      callback: callback,
      blocksInput: true,
    });
  }
}
