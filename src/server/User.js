import Tile from './../game/Tile';

export default class User {
  constructor(server, s, instance) {
    this.server = server;
    this.s = s;
    this.instance = instance;

    this.setup();
  }

  setup() {
    let events = {
      'tileAdd': (msg, instance) => {
        if(instance.instance.tiles[msg.x] && instance.instance.tiles[msg.x][msg.y]) return;
        instance.instance.addTile(msg.x, msg.y, new Tile(msg.type));
        instance.broadcast('tileAdd', msg);
      },
      'tileRemove': (msg, instance) => {
        instance.instance.removeTile(msg.x, msg.y);
        instance.broadcast('tileRemove', msg);
      },
    };

    for(let i in events) {
      let action = events[i];
      this.s.on(i, msg => {
        if(!this.instance) return;
        action(msg, this.instance, this.s, this.server);
      });
    }
  }
}