import SpriteSheet from './SpriteSheet';
import Sprite from './Sprite';

import m4 from './m4';
import webglUtils from './webgl-utils';

import drawImageVert from './shaders/draw-image.vert';
import drawImageFrag from './shaders/draw-image.frag';

class aManager {
  constructor() {
    this.gl = undefined;
    this.drawProgram = undefined;

    this.scale = 2;
    this.tileSize = 16;

    window.manager = this;

    this.programs = {};

    this.sheets = {};
    this.sprites = {};

    this.entityid = 1;
    this.entities = {};

    this.tiles = {}; // 2d array
  }

  addSheet(sheetid, path) {
    this.sheets[sheetid] = new SpriteSheet(this.gl, path);
    return this.sheets[sheetid];
  }

  addSprite(sheetid, spriteid, info) {
    this.sprites[spriteid] = new Sprite(this.gl, this.sheets[sheetid], info);
    return this.sprites[spriteid];
  }

  addEntity(entity, entityid) {
    this.entities[entityid || this.entityid++] = entity;
    return entity;
  }

  addTile(x, y, tile) {
    if(!this.tiles[x]) this.tiles[x] = {};
    this.tiles[x][y] = tile;
    localStorage.setItem('map', JSON.stringify(this.tiles));
    return tile;
  }

  removeTile(x, y) {
    if(!this.tiles[x]) this.tiles[x] = {};
    delete this.tiles[x][y];
    localStorage.setItem('map', JSON.stringify(this.tiles));
  }

  init(gl) {
    this.gl = gl;
    let draw = {};

    let program = webglUtils.createProgramFromSources(gl, [drawImageVert, drawImageFrag]);
    
    draw.positionLocation = gl.getAttribLocation(program, "a_position");
    draw.texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

    draw.matrixLocation = gl.getUniformLocation(program, "u_matrix");
    draw.timeLocation = gl.getUniformLocation(program, "time");
    draw.textureMatrixLocation = gl.getUniformLocation(program, "u_textureMatrix");
    draw.textureLocation = gl.getUniformLocation(program, "u_texture");

    draw.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, draw.positionBuffer);

    let positions = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    draw.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, draw.texcoordBuffer);
  
    let texcoords = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    this.drawProgram = program;
    this.draw = draw;
  }
}

export let Manager = new aManager();