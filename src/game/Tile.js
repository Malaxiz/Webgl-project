import { Manager } from './Manager';

export default class Tile {
  constructor(gl, sprite) {
    this.gl = gl;
    this.sprite = sprite;
  }

  render(renderer, x, y) {
    let cam = renderer.camera.box;
    let size = Manager.tileSize;
    let scale = Manager.scale;

    let tiles = Manager.tiles;
    let sum = this.getSum(x, y, tiles);

    let offset = {
      x: (sum % 4) * size,
      y: (~-(sum / 4) + 1) * size,
    };
    
    Manager.sprites[this.sprite].render(x*scale*size - cam[0], y*scale*size - cam[1], offset);
  }

  getSum(x, y, tiles) {
    let sum = 0;
    let scores = [[
      x, y-1, 1 
    ],[
      x+1, y, 2
    ],[
      x, y+1, 4
    ],[
      x-1, y, 8
    ]];

    scores.forEach(i => {
      let tile = this.tileExists(i[0], i[1], tiles);
      sum += tile ? !!(tile.sprite === this.sprite)*i[2] : 0;
    });

    return sum;
  }

  tileExists(x, y, tiles) {
    if(!tiles[x]) {
      return false;
    } else if(tiles[x][y]) {
      return tiles[x][y];
    }
    return false;
  }
}