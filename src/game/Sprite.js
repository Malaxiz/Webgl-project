import SpriteSheet from './SpriteSheet';
import { Manager } from './Manager.js';

import m4 from './m4';

export default class Sprite {
  constructor(gl, sheet, info) {
    this.gl = gl;

    this.offX = info.x || 0;
    this.offY = info.y || 0;
    this.rotation = 0;
    this.w = info.w || 16;
    this.h = info.h || 16;
    this.sheet = sheet;
  }

  render(x, y, renderer, offset={}) {
    this.doRender('draw', x, y, renderer, offset);
  }

  renderOutline(x, y, renderer, offset={}) {
    this.doRender('line', x, y, renderer, offset);
  }

  drawImage(prog, tex, texWidth, texHeight, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, srcRotation) {
    let gl = this.gl;
    let program = Manager.programs[prog].program;

    let realDims = {
      srcWidth, srcHeight,
      srcX, srcY,
    };

    if(prog === 'line') {
      srcWidth += 2.0;
      srcHeight += 2.0;
      srcX -= 1.0;
      srcY -= 1.0;

      dstWidth += 2.0 * Manager.scale;
      dstHeight += 2.0 * Manager.scale;
      dstX -= Manager.scale;
      dstY -= Manager.scale;
    }

    if (dstX === undefined) {
      dstX = srcX;
      srcX = 0;
    }
    if (dstY === undefined) {
      dstY = srcY;
      srcY = 0;
    }
    if (srcWidth === undefined) {
      srcWidth = texWidth;
    }
    if (srcHeight === undefined) {
      srcHeight = texHeight;
    }
    if (dstWidth === undefined) {
      dstWidth = srcWidth;
      srcWidth = texWidth;
    }
    if (dstHeight === undefined) {
      dstHeight = srcHeight;
      srcHeight = texHeight;
    }
    if (srcRotation === undefined) {
      srcRotation = 0;
    }

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.useProgram(program);

    let info = Manager.programs[prog].info;

    // Setup the attributes to pull data from our buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, info.positionBuffer);
    gl.enableVertexAttribArray(info.positionLocation);
    gl.vertexAttribPointer(info.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, info.texcoordBuffer);
    gl.enableVertexAttribArray(info.texcoordLocation);
    gl.vertexAttribPointer(info.texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    // this matirx will convert from pixels to clip space
    let matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

    // this matrix will translate our quad to dstX, dstY
    matrix = m4.translate(matrix, dstX, dstY, 0);

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    matrix = m4.scale(matrix, dstWidth, dstHeight, 1);

    // Set the matrix.
    gl.uniformMatrix4fv(info.matrixLocation, false, matrix);

    // just like a 2d projection matrix except in texture space (0 to 1)
    // instead of clip space. This matrix puts us in pixel space.
    let texMatrix = m4.scaling(1 / texWidth, 1 / texHeight, 1);

    // We need to pick a place to rotate around
    // We'll move to the middle, rotate, then move back
    texMatrix = m4.translate(texMatrix, texWidth * 0.5, texHeight * 0.5, 0);
    texMatrix = m4.zRotate(texMatrix, srcRotation);
    texMatrix = m4.translate(texMatrix, texWidth * -0.5, texHeight * -0.5, 0);

    // because were in pixel space
    // the scale and translation are now in pixels
    texMatrix = m4.translate(texMatrix, srcX, srcY, 0);
    texMatrix = m4.scale(texMatrix, srcWidth, srcHeight, 1);

    // Set the texture matrix.
    gl.uniformMatrix4fv(info.textureMatrixLocation, false, texMatrix);

    // Tell the shader to get the texture from texture unit 0
    gl.uniform1i(info.textureLocation, 0);
    gl.uniform1f(info.timeLocation, (Date.now() - Manager.startTime) / 1000.0);
    gl.uniform2fv(info.stepLocation, [0.02 / srcWidth, 0.02 / srcHeight ]);
    gl.uniform4fv(info.realDimsLocation, [realDims.srcX, realDims.srcY, realDims.srcWidth, realDims.srcHeight]);
    gl.uniform2fv(info.texDimLocation, [texWidth, texHeight]);
    // gl.uniform4fv(info.spriteLocation, [0.02 / srcWidth, 0.02 / srcHeight ]);

    // draw the quad (2 triangles, 6 vertices)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  doRender(program, x, y, renderer, offset={}) {
    let sheet = this.sheet;
    if(!sheet) return;

    let collision = (box1, box2) => {
      let x = 0, y = 1, w = 2, h = 3;
      if(box1[x] > box2[x] + box2[w]) return false;
      if(box1[x] + box1[w] < box2[x]) return false;
      if(box1[y] > box2[y] + box2[h]) return false;
      if(box1[y] + box1[h] < box2[y]) return false;
      return true;
    };

    let cam = renderer.camera.box;
    let scale = Manager.scale;
    x *= scale;
    y *= scale;
    let w = this.w * scale;
    let h = this.h * scale;
    
    // if(!collision([x, y, w, h], [cam[0] + 200, cam[1] + 200, cam[2] - 400, cam[3] - 400])) return;
    if(!collision([x, y, w, h], cam)) return;

    x -= cam[0];
    y -= cam[1];

    this.drawImage(program, sheet.info.texture, sheet.info.w, sheet.info.h,
                   this.offX + (offset.x || 0), this.offY + (offset.y || 0), this.w + (offset.w || 0), this.h + (offset.h || 0),
                   x, y, w, h);
  }
}