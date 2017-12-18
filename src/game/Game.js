import Entity from './Entity';
import Renderer from './Renderer';

export default class Game {
  constructor() {
    this.entities = [];
  }

  init(opts) {
    let canvas = document.getElementById('ctx');
    let gl = canvas.getContext('webgl');
    //console.log(m4, webglUtils);

    let renderer = new Renderer(gl);

    var then = 0;
    function render(time) {
      var now = time * 0.001;
      var deltaTime = Math.min(0.1, now - then);
      then = now;
  
      // update(deltaTime);
      renderer.draw();
  
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
}