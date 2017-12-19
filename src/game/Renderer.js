import { Manager } from './Manager.js';
import Sprite from './Sprite';
import Entity from './Entity';
import Camera from './Camera';

import m4 from './m4';
import webglUtils from './webgl-utils';

export default class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.camera = new Camera();

    this.frame = gl.canvas.parentElement;
    this.resize();
    
    gl.enable(gl.BLEND);
  }

  resize() {
    let gl = this.gl;
    gl.canvas.width = this.frame.clientWidth;
    gl.canvas.height = this.frame.clientHeight;

    this.camera.box[2] = gl.canvas.width;
    this.camera.box[3] = gl.canvas.height;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  }

  render(instance) {
    let gl = this.gl;
    this.resize();

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clearColor(0., 0., 0., 0.);

    for(let x in instance.tiles) {
      for(let y in instance.tiles[x]) {
        instance.tiles[x][y].render(instance, this, Number(x), Number(y));
      }
    }

    for(let i in instance.entities) {
      instance.entities[i].render(instance, this);
    }
  }
}