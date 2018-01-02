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
    let s = this.game.network.s;

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
    addEventListener('wheel', e => {
      let d = e.deltaY * 0.01;
      Manager.scale -= Manager.scale - d <= 0 ? 0 : d;
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

  update(instance) {
    let mouse = instance.entities['mouse'];
    let c = 10;

    let l = {
      'W': () => {
        mouse.box[1] -= c;
      },
      'S': () => {
        mouse.box[1] += c;
      },
      'A': () => {
        mouse.box[0] -= c;
      },
      'D': () => {
        mouse.box[0] += c;
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
      '4': () => {
        this.brush = 'testAnimation';
      },
    };

    for(let i in this.keysdown) {
      let action = l[this.keysdown[i].substr(-1)];
      action ? action() : undefined;
    }

    let s = this.game.network.s;

    let camera = this.game.renderer.camera.box;
    let xM = this.mousepos[0] + camera[0];
    let yM = this.mousepos[1] + camera[1];
    let scale = Manager.scale;

    let x = ~-(xM / scale / 16) + !!(xM > 0);
    let y = ~-(yM / scale / 16) + !!(yM > 0);

    if(this.mousedown[0]) {
      s.emit('tileAdd', {
        x, y,
        type: this.brush
      });
    }
    
    if(this.mousedown[2]) {
      s.emit('tileRemove', {
        x, y
      });
    }

    s.emit('torchMove', {
      mousepos: [(this.mousepos[0] + camera[0]) / Manager.scale - 8.0, (this.mousepos[1] + camera[1]) / Manager.scale - 14.0],
    });
  }
}