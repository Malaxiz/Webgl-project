import Instance from './../game/Instance';
import User from './User';
import Entity from './../game/Entity';

export default class ServerInstance {
  constructor(id) {
    this.id = id;

    this.instance = new Instance();
    this.users = {};

    // this.instance.addEntity(new Entity([150, 150, 16, 16], 'testAnimation'));
  }

  broadcast(type, msg, from) {
    for(let i in this.users) {
      let user = this.users[i];
      if(from && user.s.id === from.s.id) return;
      user.s.emit(type, msg);
    }
  }

  addUser(user) {
    user.instance = this;
    this.users[user.s.id] = user;    

    user.s.emit('welcome', {
      map: this.instance.tiles,
      entities: this.instance.entities
    });

    let torch = this.instance.addEntity(new Entity([150, 150, 16, 16], 'testAnimation'), `torch${user.s.id}`);

    this.broadcast('addEntity', {
      entity: torch,
      entityid: `torch${user.s.id}`
    });
  }

  update() {

  }
}