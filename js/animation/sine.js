const SINE_RENDER = (tgt, frames, amplitude, frequency, phase) => {
  return (game, frame) => {
    const progress = frame / frames;
    tgt.x = amplitude * Math.sin((frequency * progress + phase) * (Math.PI * 2));
    tgt.y = amplitude * Math.cos((frequency * progress + phase) * (Math.PI * 2));
  };
};

class SineAnimation extends GSAnimation {
  constructor(tgt, frames, amplitude, frequency, phase = 0, options) {
    super({
      ...getAnimationOptions(options),
      frames: frames,
      render: SINE_RENDER(tgt, frames, amplitude, frequency, phase),
    });

    this.tgt = tgt;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
  }
}
