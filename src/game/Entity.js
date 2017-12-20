import { Manager } from './Manager';

export default class Entity {
  constructor(box, sprite='') {
    this.box = box;
    this.sprite = sprite;
  }

  render(renderer) {
    if(!this.sprite || this.sprite === '') return;

    let scale = Manager.scale;

    let sprite = Manager.sprites[this.sprite];
    sprite.render(this.box[0] * scale, this.box[1] * scale, renderer);
    sprite.renderOutline(this.box[0] * scale, this.box[1] * scale, renderer);
  }
}