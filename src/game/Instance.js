

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
    // localStorage.setItem('map', JSON.stringify(this.tiles));
    return tile;
  }

  removeTile(x, y) {
    if(!this.tiles[x]) this.tiles[x] = {};
    delete this.tiles[x][y];
    // localStorage.setItem('map', JSON.stringify(this.tiles));
  }
}