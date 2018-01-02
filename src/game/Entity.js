import { Manager } from './Manager';

export default class Entity {
  constructor(box, renderable='') {
    this.box = box;
    this.renderable = renderable;
  }

  render(renderer) {
    if(!this.renderable || this.renderable === '') return;

    let renderable = Manager.renderables[this.renderable];
    renderable.render(this.box[0], this.box[1], renderer);
    renderable.renderOutline(this.box[0], this.box[1], renderer);
  }
}