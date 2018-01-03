import { Manager } from './Manager';
import Tile from './Tile';

import IO from 'socket.io-client';
import Entity from './Entity';

export default class Network {
  constructor(game) {
    this.game = game;

    let s = IO();
    this.s = s;

    let instance = game.instance;
    this.instance = instance;

    s.on('welcome', msg => {
      instance.tiles = {};

      let map = msg.map;
      for(let x in map) {
        for(let y in map[x]) {
          let tile = instance.addTile(Number(x), Number(y), new Tile(map[x][y].renderable));
        }
      }

      instance.entities = {};
      this.game.renderer.camera.target = this.game.instance.addEntity(new Entity([0, 0, 0, 0]), 'mouse');

      let entities = msg.entities;
      for(let i in entities) {
        let entity = entities[i];
        instance.addEntity(new Entity(entity.box, entity.renderable), i);
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
      'updateEntity': msg => {
        if(!msg.entity) return;
        instance.entities[msg.entityid].targetBox = msg.entity.box;
      },
      'addEntity': msg => {
        instance.addEntity(new Entity(msg.entity.box, msg.entity.renderable), msg.entityid);
      },
      'removeEntity': msg => {
        instance.removeEntity(msg.entityid);
      },
      'entityEvent': msg => {
        let entity = instance.entities[msg.entityid];
        entity && entity.event(msg.event, this.game);
      }
    };

    for(let i in events) {
      this.s.on(i, events[i]);
    }
  }
}