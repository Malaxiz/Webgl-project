import Instance from './../game/Instance';
import User from './User';

export default class ServerInstance {
  constructor(id) {
    this.id = id;

    this.instance = new Instance();
    this.users = {};
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
  }

  update() {

  }
}