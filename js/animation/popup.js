const POPUP_FRAMES_PER_PX = 0.012;
const POPUP_CORNER_SLICE_SIZE = 24;
const POPUP_NINESLICE_SIZE = 128;

const POPUP_CORNER_SIZE = POPUP_CORNER_SLICE_SIZE;

const RENDER_POPUP = (width, height, hMid, vMid, showBackground, renderContents, opacity) => {
  const VERTICAL_FRAMES = height * POPUP_FRAMES_PER_PX;
  const HORIZONTAL_FRAMES = width * POPUP_FRAMES_PER_PX;
  return (game, frame) => {
    let left = 0;
    let top = 0;
    let innerWidth = 0;
    let innerHeight = 0;

    if (frame < VERTICAL_FRAMES) {
      innerWidth = 0;
      innerHeight = height * (frame / VERTICAL_FRAMES);
    } else if (frame < VERTICAL_FRAMES + HORIZONTAL_FRAMES) {
      innerWidth = width * ((frame - VERTICAL_FRAMES) / HORIZONTAL_FRAMES);
      innerHeight = height;
    } else {
      innerHeight = height;
      innerWidth = width;
    }

    left = hMid - POPUP_CORNER_SIZE - innerWidth / 2;
    top = vMid - POPUP_CORNER_SIZE - innerHeight / 2;

    // console.log({ left, top });

    if (showBackground) {
      game.drawRect(BOARD_PADDING, BOARD_PADDING, BOARD_SIZE, BOARD_SIZE, {
        fill: "#BDAFA1",
      });
    }

    game.ctx.save();
    game.ctx.globalAlpha = opacity;

    // draw corners
    game.drawImage(
      ASSETS.UI.POPUP,
      left,
      top,
      POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      {
        x: 0,
        y: 0,
        width: POPUP_CORNER_SLICE_SIZE,
        height: POPUP_CORNER_SLICE_SIZE,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE + innerWidth,
      top,
      POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      {
        x: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE,
        y: 0,
        width: POPUP_CORNER_SLICE_SIZE,
        height: POPUP_CORNER_SLICE_SIZE,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left,
      top + POPUP_CORNER_SIZE + innerHeight,
      POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      {
        x: 0,
        y: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE,
        width: POPUP_CORNER_SLICE_SIZE,
        height: POPUP_CORNER_SLICE_SIZE,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE + innerWidth,
      top + POPUP_CORNER_SIZE + innerHeight,
      POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      {
        x: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE,
        y: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE,
        width: POPUP_CORNER_SLICE_SIZE,
        height: POPUP_CORNER_SLICE_SIZE,
      }
    );
    // draw center
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE,
      top + POPUP_CORNER_SIZE,
      innerWidth,
      innerHeight,
      {
        x: POPUP_CORNER_SLICE_SIZE,
        y: POPUP_CORNER_SLICE_SIZE,
        width: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE * 2,
        height: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE * 2,
      }
    );
    // draw edges
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE,
      top,
      innerWidth,
      POPUP_CORNER_SIZE,
      {
        x: POPUP_CORNER_SLICE_SIZE,
        y: 0,
        width: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE * 2,
        height: POPUP_CORNER_SLICE_SIZE,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE,
      top + POPUP_CORNER_SIZE + innerHeight,
      innerWidth,
      POPUP_CORNER_SIZE,
      {
        x: POPUP_CORNER_SLICE_SIZE,
        y: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE,
        width: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE * 2,
        height: POPUP_CORNER_SLICE_SIZE,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left,
      top + POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      innerHeight,
      {
        x: 0,
        y: POPUP_CORNER_SLICE_SIZE,
        width: POPUP_CORNER_SLICE_SIZE,
        height: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE * 2,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE + innerWidth,
      top + POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      innerHeight,
      {
        x: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE,
        y: POPUP_CORNER_SLICE_SIZE,
        width: POPUP_CORNER_SLICE_SIZE,
        height: POPUP_NINESLICE_SIZE - POPUP_CORNER_SLICE_SIZE * 2,
      }
    );

    game.ctx.restore();

    const mask = new Path2D();

    mask.rect(
      left + POPUP_CORNER_SIZE,
      top + POPUP_CORNER_SIZE,
      innerWidth,
      innerHeight
    );

    if (renderContents) {
      game.ctx.save();
      game.ctx.clip(mask);
      renderContents(game, frame);
      game.ctx.restore();
    }
  };
};

class PopupAnimation extends GSAnimation {
  constructor(width, height, hMid, vMid, showBackground, renderContents, callback, overrides = {}) {
    const handleInput = () => {
      return this.frame >= this.frames;
    };

    super({
      frames: Math.ceil((width + height) * POPUP_FRAMES_PER_PX),
      render: RENDER_POPUP(width, height, hMid, vMid, showBackground, renderContents, overrides.opacity ?? 1),
      blocksInput: true,
      needsInput: true,
      handleInput,
      callback,
      absoluteSize: true,
      ...overrides
    });
  }
}
