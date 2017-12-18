import Entity from './Entity';
import Renderer from './Renderer';

export default class Game {
  constructor() {
    this.entities = [];
  }

  init(opts) {
    let canvas = document.getElementById('ctx');
    let gl = canvas.getContext('webgl');

    let renderer = new Renderer(gl);

    let then = 0;
    let render = time => {
      let now = time * 0.001;
      let deltaTime = Math.min(0.1, now - then);
      then = now;
  
      renderer.draw();
  
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
}