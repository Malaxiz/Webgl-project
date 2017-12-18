// SpriteSheet.js

export default class SpriteSheet {
  constructor(gl, src) {
    this.gl = gl;

    this.loaded = false;
    this.info = this.loadImageAndCreateTextureInfo(src);
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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    let textureInfo = {
      w: 1,
      h: 1,
      texture: tex,
    };
    let img = new Image();
    img.addEventListener('load', () => {
      textureInfo.w = img.width;
      textureInfo.h = img.height;

      gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      this.loaded = true;
    });
    img.src = `./assets/${url}`;

    return textureInfo;
  }
}