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

  render(x, y, offset={}) {
    let sheet = this.sheet;
    if(!sheet) return;
    
    this.drawImage(sheet.info.texture, sheet.info.w, sheet.info.h,
                   this.offX + (offset.x || 0), this.offY + (offset.y || 0), this.w + (offset.w || 0), this.h + (offset.h || 0),
                   x, y, this.w * Manager.scale, this.h * Manager.scale);
  }

  drawImage(tex, texWidth, texHeight, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, srcRotation) {
    let gl = this.gl;
    let program = Manager.drawProgram;

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

    // Setup the attributes to pull data from our buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, Manager.draw.positionBuffer);
    gl.enableVertexAttribArray(Manager.draw.positionLocation);
    gl.vertexAttribPointer(Manager.draw.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, Manager.draw.texcoordBuffer);
    gl.enableVertexAttribArray(Manager.draw.texcoordLocation);
    gl.vertexAttribPointer(Manager.draw.texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    // this matirx will convert from pixels to clip space
    let matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

    // this matrix will translate our quad to dstX, dstY
    matrix = m4.translate(matrix, dstX, dstY, 0);

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    matrix = m4.scale(matrix, dstWidth, dstHeight, 1);

    // Set the matrix.
    gl.uniformMatrix4fv(Manager.draw.matrixLocation, false, matrix);

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
    gl.uniformMatrix4fv(Manager.draw.textureMatrixLocation, false, texMatrix);

    // Tell the shader to get the texture from texture unit 0
    gl.uniform1i(Manager.draw.textureLocation, 0);

    // draw the quad (2 triangles, 6 vertices)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}