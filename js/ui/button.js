const DEFAULT_DRAW_PARAMS = {
  fill: "#643c3b",
  stroke: "#532d2c",
  strokeWidth: 2,
  color: "hsl(2, 31%, 20%)",
  font: "700 14px monospace",
  fontSize: 14,
  align: "center",
};

const DEFAULT_HOVER_PARAMS = {
  fill: "#753432",
  stroke: "#612423",
  strokeWidth: 2,
  color: "hsl(1, 47%, 21%)",
  font: "700 14px monospace",
  fontSize: 14,
  align: "center",
};

class Button {
  constructor(
    game,
    {
      x,
      y,
      width,
      height,
      text,
      drawParams = {},
      hoverParams = {},
      clickCallback = THUNK,
    },
  ) {
    this.id = Math.random().toString(16).substring(2, 6);
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.drawParams = {
      ...DEFAULT_DRAW_PARAMS,
      ...drawParams,
    };
    this.hoverParams = {
      ...DEFAULT_HOVER_PARAMS,
      ...hoverParams,
    };
    this.clickCallback = clickCallback;

    this.hovered = false;

    this.attachListener();
  }

  render() {
    const params = this.hovered ? this.hoverParams : this.drawParams;
    this.game.drawRect(this.x, this.y, this.width, this.height, params);

    this.game.drawText(
      this.text,
      this.x + this.width * 0.5,
      this.y + this.height * 0.5 - params.fontSize * 0.4,
      params,
    );
  }

  attachListener() {
    this.game.mouseListeners[this.id] = this;
  }
}
