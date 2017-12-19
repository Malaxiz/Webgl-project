import { Manager } from './Manager';

import Entity from './Entity';
import Renderer from './Renderer';
import Tile from './Tile';
import Event from './Event';

export default class Game {
  constructor() {
    this.entities = [];

    // let m = e => {
    //   if(!this.renderer) return;

    //   let box = Manager.entities['mouse'].box;
    //   box[0] = 300 - e.pageX;
    //   box[1] = 300 - e.pageY;
    // };
    // addEventListener('mousemove', m, false);
  }

  init(opts) {
    let canvas = document.getElementById('ctx');
    let gl = canvas.getContext('webgl');
    this.gl = gl;

    let renderer = new Renderer(gl);
    this.renderer = renderer;

    this.setup();

    let event = new Event(this);
    this.event = event;

    let then = 0;
    let delta = 0;
    let render = time => {
      let now = time;
      delta = Math.min(0.1, now - then);
      then = now;
  
      event.update(delta);
      renderer.camera.update(delta);
      renderer.render(delta);
  
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
      w: 16,
      h: 16,
    });
    Manager.addSprite('TILES', 'woodTiles', {
      x: 256,
      y: 0,
      w: 16,
      h: 16,
    });
    Manager.addSprite('TILES', 'stoneTiles', {
      x: 64,
      y: 0,
      w: 16,
      h: 16,
    });

    let loaded = localStorage.getItem('map');
    try {
      loaded = JSON.parse(loaded);
    } catch(e) { }

    if(loaded) {
      for(let x in loaded) {
        for(let y in loaded[x]) {
          Manager.addTile(x, y, new Tile(loaded[x][y].sprite));
        }
      }
    } else {
      let range = (l,r) => new Array(r - l).fill().map((_,k) => k + l);
      for(let y in range(0, 5)) {
        for(let x in range(0, 10)) {
          Manager.addTile(x, y, new Tile('grassTiles'));
        }
      }
    }

    let add = (x, y, sprite) => Manager.addTile(x, y, new Tile(sprite));
    window.add = add;

    this.renderer.camera.target = Manager.addEntity(new Entity([0, 0, 0, 0]), 'mouse');
  }
}