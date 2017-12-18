import { Manager } from './Manager.js';
import Sprite from './Sprite';
import Entity from './Entity';
import Camera from './Camera';

import m4 from './m4';
import webglUtils from './webgl-utils';

import drawImageVert from './shaders/draw-image.vert';
import drawImageFrag from './shaders/draw-image.frag';

export default class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.camera = new Camera();

    Manager.init(gl);

    Manager.addSheet('MAIN', 'sheet.png');
    Manager.addSprite('MAIN', 'testSprite', {
      offX: 16,
      offY: 0,
    });

    var range = (l,r) => new Array(r - l).fill().map((_,k) => k + l);
    for(let y in range(0, 10)) {
      for(let x in range(0, 10)) {
        Manager.addEntity(new Entity([x*16*Manager.scale, y*16*Manager.scale, 16, 16], 'testSprite'));
      }
    }

    this.camera.target = Manager.addEntity(new Entity([0, 0, 0, 0]), 'mouse');

    this.frame = gl.canvas.parentElement;
    this.resize();
    
    gl.enable(gl.BLEND);
  }

  resize() {
    let gl = this.gl;
    gl.canvas.width = this.frame.clientWidth;
    gl.canvas.height = this.frame.clientHeight;
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  }

  render() {
    let gl = this.gl;
    this.resize();

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clearColor(0., 0., 0., 0.);

    for(let i in Manager.entities) {
      Manager.entities[i].render(this);
    }
  }
}