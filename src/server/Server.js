import ServerInstance from './ServerInstance';
import User from './User';

import Tile from './../game/Tile';
import { setImmediate } from 'timers';

export default class Server {
  constructor() {
    this.instances = {}; // ServerInstances
    this.users = {};

    this.instances['lobby'] = new ServerInstance('lobby');

    let range = (l,r) => new Array(r - l).fill().map((_,k) => k + l);
    for(let y in range(0, 5)) {
      for(let x in range(0, 10)) {
        this.instances['lobby'].instance.addTile(x, y, new Tile('grassTiles'));
      }
    }

    let timestep = 1000.0 / 60.0;

    let then = Date.now();
    let delta = 0;
    let update = () => {
      let now = Date.now();
      delta += now - then;
      then = now;

      while(delta >= timestep) {
        for(let i in this.instances) {
          this.instances[i].update();
        }
        delta -= timestep;
      }

      setImmediate(update);
    }
    update();
  }

  newSocket(s) {
    console.log(`new connection: ${s.id}`);

    let user = new User(this, s);
    this.users[s.id] = user;
    this.instances['lobby'].addUser(user);
  }
}