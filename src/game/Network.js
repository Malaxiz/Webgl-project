import { Manager } from './Manager';
import Tile from './Tile';

import IO from 'socket.io-client';

export default class Network {
  constructor(game) {
    this.game = game;

    let socket = IO();
    this.socket = socket;

    socket.on('welcome', msg => {
      let map = msg.map;
      for(let x in map) {
        for(let y in map[x]) {
          Manager.addTile(x, y, new Tile(map[x][y].sprite));
        }
      }
    });
  }

  event(e) {

  }
}