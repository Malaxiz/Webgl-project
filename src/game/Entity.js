import { Manager } from './Manager';

export default class Entity {
  constructor(box, renderable='') {
    this.box = box;
    this.renderable = renderable;

    this.components = {};
  }

  addComponent(component) {
    this.components[component.constructor.name] = component;
    return component;
  }

  event(event, game) {
    for(let i in this.components) {
      let component = this.components[i];
      component.event && component.event(event, game);
    }
  }

  update(game) {
    for(let i in this.components) {
      let component = this.components[i];
      component.update && component.update(game);
    }
  }

  render(renderer) {
    if(!this.renderable || this.renderable === '') return;

    let renderable = Manager.renderables[this.renderable];
    renderable.render(this.box[0], this.box[1], renderer);

    for(let i in this.components) {
      let component = this.components[i];
      component.render && component.render();
    }

    renderable.renderOutline(this.box[0], this.box[1], renderer);
  }
}