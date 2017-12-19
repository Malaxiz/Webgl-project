import Instance from './../game/Instance';
import Tile from './../game/Tile';

export default class Server {
  constructor() {
    this.instances = {};
    this.sockets = {};

    // let manager = new aManager();
    // this.manager = manager;

    let range = (l,r) => new Array(r - l).fill().map((_,k) => k + l);
    for(let y in range(0, 5)) {
      for(let x in range(0, 10)) {
        // manager.addTile(x, y, new Tile('grassTiles'));
      }
    }
  }

  newSocket(s) {
    console.log(`new connection: ${s.id}`);
    s.on('disconnect', () => {
      console.log('disconnect');
    })
  
    s.on('mousedown', msg => {
      console.log(msg);
    });

    s.emit('welcome', {
      // map: this.manager.tiles
    });

    this.sockets[s.id] = s;
  }
}