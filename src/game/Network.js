import { Manager } from './Manager';

import IO from 'socket.io-client';

export default class Network {
  constructor(game) {
    this.game = game;

    let socket = IO();
  }

  event(e) {

  }
}