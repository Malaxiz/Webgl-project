import { Manager } from './Manager';

import Entity from './Entity';
import Renderer from './Renderer';

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

    let renderer = new Renderer(gl);
    this.renderer = renderer;

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
}