import { Manager } from './Manager';

export default class Entity {
  constructor(box, renderable='') {
    this.box = box;
    this.targetBox = box;
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
    let doEvent = msg => {
      game.network.s.emit('componentEvent', {
        entityId: ''
      });
    };

    for(let i in this.components) {
      let component = this.components[i];
      component.update && component.update(game, doEvent);
    }

    if(!this.targetBox || this.targetBox === this.box) return;
    let target = this.targetBox;

    for(let i in [0,1]) {
      let d = ((~-(target[i] - this.box[i])) / 2);
      if(d === 0) continue;
      this.box[i] += (d < -1 || d > 1) ? Math.round(d) : (d < 0 ? -1 : 1);
    }

    // for(let i in [0,1]) {
    //   let d = ((target[i] - this.box[i]) / 10);
    //   if(d > -1 && d < 1) {
    //     // this.box[i] = target[i];
    //     this.box[i] += d;
    //   } else 
    //   {
    //     this.box[i] += Math.round(d);
    //   }
    // }
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