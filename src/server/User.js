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
      'disconnect': (msg, instance) => {
        console.log('user disconnect')
        instance.instance.removeEntity(`torch${this.s.id}`);
        instance.broadcast('removeEntity', {
          entityid: `torch${this.s.id}`
        });
      },
      'tileAdd': (msg, instance) => {
        if(instance.instance.tiles[msg.x] && instance.instance.tiles[msg.x][msg.y]) return;
        instance.instance.addTile(msg.x, msg.y, new Tile(msg.type));
        instance.broadcast('tileAdd', msg);
      },
      'tileRemove': (msg, instance) => {
        instance.instance.removeTile(msg.x, msg.y);
        instance.broadcast('tileRemove', msg);
      },
      'torchMove': (msg, instance) => {
        let entity = instance.instance.entities[`torch${this.s.id}`];

        entity.box[0] = msg.mousepos[0];
        entity.box[1] = msg.mousepos[1];

        instance.broadcast('updateEntity', {
          entity, entityid: `torch${this.s.id}`,
        });
      }
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