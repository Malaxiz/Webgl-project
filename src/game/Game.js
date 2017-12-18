import { Manager } from './Manager';

import Entity from './Entity';
import Renderer from './Renderer';
import Tile from './Tile';

export default class Game {
  constructor() {
    this.entities = [];

    let m = e => {
      if(!this.renderer) return;

      let box = Manager.entities['mouse'].box;
      box[0] = 300 - e.pageX;
      box[1] = 300 - e.pageY;
    };
    addEventListener('mousemove', m, false);
  }

  init(opts) {
    let canvas = document.getElementById('ctx');
    let gl = canvas.getContext('webgl');
    this.gl = gl;

    let renderer = new Renderer(gl);
    this.renderer = renderer;

    this.setup();

    let then = 0;
    let render = time => {
      let now = time * 0.001;
      let delta = Math.min(0.1, now - then);
      then = now;
  
      renderer.render();
      renderer.camera.update(delta);
  
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  setup() {
    let gl = this.gl;
    Manager.init(gl);
    
    Manager.addSheet('MAIN', 'sheet.png');
    Manager.addSheet('TILES', 'tiles.png');
    Manager.addSprite('MAIN', 'testSprite', {
      x: 16,
      y: 32,
    });
    Manager.addSprite('TILES', 'grassTiles', {
      x: 0,
      y: 0,
      w: 64,
      h: 64,
    });
    Manager.addSprite('TILES', 'woodTiles', {
      x: 256,
      y: 0,
      w: 64,
      h: 64,
    });
    Manager.addSprite('TILES', 'stoneTiles', {
      x: 64,
      y: 0,
      w: 64,
      h: 64,
    });

    var range = (l,r) => new Array(r - l).fill().map((_,k) => k + l);
    for(let y in range(0, 5)) {
      for(let x in range(0, 10)) {
        Manager.addTile(x, y, new Tile(gl, 'grassTiles'));
      }
    }
    Manager.addTile(2, 3, new Tile(gl, 'woodTiles'));
    Manager.addTile(5, 2, new Tile(gl, 'stoneTiles'));

    this.renderer.camera.target = Manager.addEntity(new Entity([0, 0, 0, 0]), 'mouse');
  }
}