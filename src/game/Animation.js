import Sprite from './Sprite';
import { Manager } from './Manager';

export default class Animation {
  constructor(sprites, info) {
    this.sprites = sprites;
    this.start = Date.now();
    this.mod = 1000.0 / this.sprites.length;

    this.info = {
      fps: (info.fps * 1/2 || 2 * 1/2),
    };

    this.active = this.getSprite();
  }

  getSprite() {
    let amount = this.sprites.length;
    let ind = Math.floor(((Date.now() - this.start) * this.info.fps) % 1000.0 / 1000.0 * this.sprites.length);
    return Manager.renderables[this.sprites[ind]];
  }

  render(x, y, renderer, offset={}) {
    this.active = this.getSprite();
    this.active.render(x, y, renderer, offset);
  }

  renderOutline(x, y, renderer, offset={}) {
    this.active.renderOutline(x, y, renderer, offset);
  }

}