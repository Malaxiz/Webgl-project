

export default class Instance {
  constructor() {
    this.entityid = 1;
    this.entities = {};

    this.tiles = {}; // 2d array
  }

  addEntity(entity, entityid) {
    this.entities[entityid || `auto${this.entityid++}`] = entity;
    return entity;
  }

  removeEntity(entityid) {
    delete this.entities[entityid];
  }

  addTile(x, y, tile) {
    if(!this.tiles[x]) this.tiles[x] = {};
    this.tiles[x][y] = tile;
    this.updateTiles(x, y);

    // localStorage.setItem('map', JSON.stringify(this.tiles));
    return tile;
  }

  updateAllTiles() {
    for(let x in this.tiles) {
      for(let y in this.tiles[x]) {
        this.updateTiles(x, y);
        console.log('here')
      }
    }
  }

  updateTiles(x, y) {
    let scores = [[
      x, y-1
    ],[
      x+1, y
    ],[
      x, y+1
    ],[
      x-1, y
    ],[
      x, y
    ]];

    for(let i in scores) {
      let score = scores[i];
      let tile = this.tiles[score[0]] ? this.tiles[score[0]][score[1]] : undefined;
      if(tile) {
        tile.updateSum(score[0], score[1], this.tiles);
      }
    }
  }

  removeTile(x, y) {
    if(!this.tiles[x]) this.tiles[x] = {};
    delete this.tiles[x][y];
    this.updateTiles(x, y);
    // localStorage.setItem('map', JSON.stringify(this.tiles));
  }
}