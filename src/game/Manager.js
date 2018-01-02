import SpriteSheet from './SpriteSheet';
import Sprite from './Sprite';

import m4 from './m4';
import webglUtils from './webgl-utils';

import drawImageVert from './shaders/draw-image.vert';
import drawImageFrag from './shaders/draw-image.frag';

import drawLineVert from './shaders/draw-outline.vert';
import drawLineFrag from './shaders/draw-outline.frag';

export default class AssetManager {
  constructor() {
    this.gl = undefined;
    this.startTime = Date.now();

    try {
      this.loadContext = document.getElementById('temp');
    } catch(e) { }

    this.scale = 2;
    this.tileSize = 16;

    this.programs = {};
    this.sheets = {};
    this.sprites = {};
    this.programs = {};
  }

  addSheet(sheetid, path) {
    this.sheets[sheetid] = new SpriteSheet(this.gl, path);
    return this.sheets[sheetid];
  }

  addSprite(sheetid, spriteid, info) {
    this.sprites[spriteid] = new Sprite(this.gl, this.sheets[sheetid], info);
    return this.sprites[spriteid];
  }

  init(gl) {
    this.gl = gl;
    
    this.programs['draw'] = this.spriteProgram(drawImageVert, drawImageFrag);
    this.programs['line'] = this.spriteProgram(drawLineVert, drawLineFrag);
  }

  spriteProgram(vert, frag) {
    let gl = this.gl;
    let info = {};
    let program = webglUtils.createProgramFromSources(gl, [vert, frag]);

    info.positionLocation = gl.getAttribLocation(program, "a_position");
    info.texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

    info.matrixLocation = gl.getUniformLocation(program, "u_matrix");
    info.timeLocation = gl.getUniformLocation(program, "time");
    info.stepLocation = gl.getUniformLocation(program, "stepSize");
    info.textureMatrixLocation = gl.getUniformLocation(program, "u_textureMatrix");
    info.textureLocation = gl.getUniformLocation(program, "u_texture");
    info.spriteLocation = gl.getUniformLocation(program, "sprite");
    info.realDimsLocation = gl.getUniformLocation(program, "realDims");
    info.texDimLocation = gl.getUniformLocation(program, "texDim");

    info.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, info.positionBuffer);

    let positions = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    info.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, info.texcoordBuffer);
  
    let texcoords = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    return { program, info };
  }
}

export let Manager = new AssetManager();