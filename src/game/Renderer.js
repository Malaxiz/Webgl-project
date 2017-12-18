import { Manager } from './Manager.js';
import Sprite from './Sprite';
import Entity from './Entity';

import m4 from './m4';
import webglUtils from './webgl-utils';

import drawImageVert from './shaders/draw-image.vert';
import drawImageFrag from './shaders/draw-image.frag';

export default class Renderer {
  constructor(gl) {
    this.gl = gl;
    Manager.init(gl);

    Manager.addSheet('MAIN', 'sheet.png');
    Manager.addSprite('MAIN', 'testSprite', {
      offX: 0,
      offY: 0,
    });

    var range = (l,r) => new Array(r - l).fill().map((_,k) => k + l);
    for(let y in range(0, 10)) {
      for(let x in range(0, 10)) {
        Manager.addEntity(new Entity([x*16*Manager.scale, y*16*Manager.scale, 16, 16], 'testSprite'));
      }
    }

    this.frame = gl.canvas.parentElement;
    this.resize();
    
    gl.enable(gl.BLEND);
  }

  update() {
    let gl = this.gl;
    let drawInfos = [];
    let numToDraw = 900;
    let speed = 60;
    for (let ii = 0; ii < numToDraw; ++ii) {
      let drawInfo = {
        x: ~-(Math.random() * gl.canvas.width),
        y: ~-(Math.random() * gl.canvas.height),
        scale: 5,
        offX: 256 - 16*(~-(Math.random() * 17) + 1),
        offY: 256 - 16*(~-(Math.random() * 17) + 1),
        rotation: 0,// 0.2 * Math.PI * 2,// Math.random() * Math.PI * 2,
        width:  16,
        height: 16,
        textureInfo: this.textureInfos[0],
      };
      drawInfos.push(drawInfo);
    }
    this.drawInfos = drawInfos;
  }

  resize() {
    let gl = this.gl;
    gl.canvas.width = this.frame.clientWidth;
    gl.canvas.height = this.frame.clientHeight;
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  }

  draw() {
    let gl = this.gl;
    this.resize();

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clearColor(0., 0., 0., 0.);

    for(let i in Manager.entities) {
      Manager.entities[i].render();
    }
  }
}