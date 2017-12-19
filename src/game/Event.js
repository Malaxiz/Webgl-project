import { Manager } from './Manager';
import Tile from './Tile';

export default class Event {
  constructor(game) {
    this.game = game;

    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);

    this.keysdown = [];
    this.mousedown = [false, false, false];
    this.mousepos = [0, 0];

    this.brush = 'woodTiles';

    this.init();
  }

  init() {
    document.getElementById('ctx').oncontextmenu = () => false;

    addEventListener('keydown', this.keydown);
    addEventListener('keyup', this.keyup);
    addEventListener('mousedown', e => {
      e.preventDefault();
      this.mousedown[e.button] = true;
      return false;
    });
    addEventListener('mouseup', e => {
      this.mousedown[e.button] = false;
      return false;
    });
    addEventListener('mousemove', e => {
      this.mousepos = [e.clientX - 5, e.clientY - 5];
    });
  }

  keydown(e) {
    if(this.keysdown.includes(e.code)) return;
    console.log(e)
    this.keysdown.push(e.code)
  }

  keyup(e) {
    let index = this.keysdown.indexOf(e.code);
    this.keysdown.splice(index, 1);
  }

  update(delta) {
    let mouse = Manager.entities['mouse'];

    let l = {
      'W': () => {
        mouse.box[1] -= 20;
      },
      'S': () => {
        mouse.box[1] += 20;
      },
      'A': () => {
        mouse.box[0] -= 20;
      },
      'D': () => {
        mouse.box[0] += 20;
      },
      '1': () => {
        this.brush = 'grassTiles';
      },
      '2': () => {
        this.brush = 'woodTiles';
      },
      '3': () => {
        this.brush = 'stoneTiles';
      },
    };

    for(let i in this.keysdown) {
      let action = l[this.keysdown[i].substr(-1)];
      action ? action() : undefined;
    }

    let camera = this.game.renderer.camera.box;
    let x = this.mousepos[0] + camera[0];
    let y = this.mousepos[1] + camera[1];
    let scale = Manager.scale;

    if(this.mousedown[0]) {
      Manager.addTile(~-(x / scale / 16) + !!(x > 0), ~-(y / scale / 16) + !!(y > 0), new Tile(this.brush));
    }
    
    if(this.mousedown[2]) {
      Manager.removeTile(~-(x / scale / 16) + !!(x > 0), ~-(y / scale / 16) + !!(y > 0));
    }

  }
}