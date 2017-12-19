import { Manager } from './Manager';

export default class Entity {
  constructor(box, sprite='') {
    this.box = box;
    this.sprite = sprite;
  }

  render(renderer) {
    if(!this.sprite || this.sprite === '') return;

    Manager.sprites[this.sprite].render(this.box[0], this.box[1], renderer);
  }
}