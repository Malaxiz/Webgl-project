import m4 from './m4';
import webglUtils from './webgl-utils';

import drawImageVert from './shaders/draw-image.vert';
import drawImageFrag from './shaders/draw-image.frag';

export default class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.frame = gl.canvas.parentElement;

    let program = webglUtils.createProgramFromSources(gl, [drawImageVert, drawImageFrag]);

    this.positionLocation = gl.getAttribLocation(program, "a_position");
    this.texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

    this.matrixLocation = gl.getUniformLocation(program, "u_matrix");
    this.textureMatrixLocation = gl.getUniformLocation(program, "u_textureMatrix");
    this.textureLocation = gl.getUniformLocation(program, "u_texture");

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    let positions = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    this.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
  
    let texcoords = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    let textureInfos = [
      this.loadImageAndCreateTextureInfo('star.jpg'),
      this.loadImageAndCreateTextureInfo('star.jpg'),
    ];

    let drawInfos = [];
    let numToDraw = 9;
    let speed = 60;
    for (let ii = 0; ii < numToDraw; ++ii) {
      let drawInfo = {
        x: Math.random() * gl.canvas.width,
        y: Math.random() * gl.canvas.height,
        dx: Math.random() > 0.5 ? -1 : 1,
        dy: Math.random() > 0.5 ? -1 : 1,
        xScale: Math.random() * 0.25 + 0.25,
        yScale: Math.random() * 0.25 + 0.25,
        offX: Math.random() * 0.75,
        offY: Math.random() * 0.75,
        offX: 0,
        offY: 0,
        rotation: Math.random() * Math.PI * 2,
        deltaRotation: (0.5 + Math.random() * 0.5) * (Math.random() > 0.5 ? -1 : 1),
        width:  1,
        height: 1,
        textureInfo: textureInfos[0],
      };
      drawInfos.push(drawInfo);
    }
    this.drawInfos = drawInfos;
    this.program = program;
  }

  loadImageAndCreateTextureInfo(url) {
    let gl = this.gl;
    let tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    let textureInfo = {
      width: 1,
      height: 1,
      texture: tex,
    };
    let img = new Image();
    img.addEventListener('load', function() {
      textureInfo.width = img.width;
      textureInfo.height = img.height;

      gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    });
    img.src = `./assets/${url}`;

    return textureInfo;
  }

  draw() {
    let gl = this.gl;
    gl.canvas.width = this.frame.clientWidth;
    gl.canvas.height = this.frame.clientHeight;
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    this.drawInfos.forEach((drawInfo) => {
      let dstX      = drawInfo.x;
      let dstY      = drawInfo.y;
      let dstWidth  = drawInfo.textureInfo.width  * drawInfo.xScale;
      let dstHeight = drawInfo.textureInfo.height * drawInfo.yScale;

      let srcX      = drawInfo.textureInfo.width  * drawInfo.offX;
      let srcY      = drawInfo.textureInfo.height * drawInfo.offY;
      let srcWidth  = drawInfo.textureInfo.width  * drawInfo.width;
      let srcHeight = drawInfo.textureInfo.height * drawInfo.height;

      this.drawImage(
        drawInfo.textureInfo.texture,
        drawInfo.textureInfo.width,
        drawInfo.textureInfo.height,
        srcX, srcY, srcWidth, srcHeight,
        dstX, dstY, dstWidth, dstHeight,
        drawInfo.rotation);
    });
  }

  drawImage(
      tex, texWidth, texHeight,
      srcX, srcY, srcWidth, srcHeight,
      dstX, dstY, dstWidth, dstHeight,
      srcRotation) {

    let gl = this.gl;
    let program = this.program;
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

    gl.bindTexture(gl.TEXTURE_2D, tex);

    // Tell WebGL to use our shader program pair
    gl.useProgram(program);

    // Setup the attributes to pull data from our buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.enableVertexAttribArray(this.texcoordLocation);
    gl.vertexAttribPointer(this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    // this matirx will convert from pixels to clip space
    let matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

    // this matrix will translate our quad to dstX, dstY
    matrix = m4.translate(matrix, dstX, dstY, 0);

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    matrix = m4.scale(matrix, dstWidth, dstHeight, 1);

    // Set the matrix.
    gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

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
    gl.uniformMatrix4fv(this.textureMatrixLocation, false, texMatrix);

    // Tell the shader to get the texture from texture unit 0
    gl.uniform1i(this.textureLocation, 0);

    // draw the quad (2 triangles, 6 vertices)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}