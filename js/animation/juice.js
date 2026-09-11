const CONSTANT_ONE = (frame) => 1;

const TAPER_FUNCTION = (frames) => (frame) => 1 - frame / frames;

const JUICE_RENDER =
  (juice, frames, magnitude, fn = TAPER_FUNCTION(frames)) =>
  (game, frame) => {
    juice.zero().randomize().normalize().scale(fn(frame)).scale(magnitude);
    if (frame == frames) {
      juice.zero();
    }
  };

class JuiceAnimation extends GSAnimation {
  constructor(juice, frames, magnitude, options) {
    super({
      ...getAnimationOptions(options),
      frames: frames,
      render: JUICE_RENDER(juice, frames, magnitude),
    });
  }
}
