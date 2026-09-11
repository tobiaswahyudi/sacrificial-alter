class WorldMap {
  constructor(game) {
    this.game = game;
    this.screens = {}
    this.parse(WORLD_MAP, TILE_ROWS, TILE_COLS);
  }

  parse(str, ySize, xSize) {
    str = str.split('\n').filter(l => l.trim().length);

    const rows = str.length / ySize;
    const cols = Math.ceil(str[0].length / (xSize + 1));

    for(let i = 0; i < rows; i++) {
      this.screens[i] = [];
      for(let j = 0; j < cols; j++) {
        // cpp i miss u :'(
        this.screens[i].push([])
      }
    }

    console.log(this.screens)

    str.forEach((line, rIdx) => {
      const row = Math.floor(rIdx / ySize);
      line.trim().split(' ').forEach((part, cIdx) => {
        this.screens[row][cIdx].push([...part]);
      })
    })
  }

  get(row, col) {
    if(row < 0 || row <= this.screens.length) return undefined;
    return this.screens[row][col]
  }
}
