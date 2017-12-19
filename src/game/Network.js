import { Manager } from './Manager';
import Tile from './Tile';

import IO from 'socket.io-client';

export default class Network {
  constructor(game) {
    this.game = game;

    let s = IO();
    this.s = s;

    let instance = game.instance;
    this.instance = instance;

    s.on('welcome', msg => {
      let map = msg.map;
      for(let x in map) {
        for(let y in map[x]) {
          instance.addTile(x, y, new Tile(map[x][y].sprite));
        }
      }
    });

    this.setup();
  }

  setup() {
    let instance = this.instance;

    let events = {
      'tileAdd': msg => {
        instance.addTile(msg.x, msg.y, new Tile(msg.type));
      },
      'tileRemove': msg => {
        instance.removeTile(msg.x, msg.y);
      },
    };

    for(let i in events) {
      this.s.on(i, events[i]);
    }
  }
}