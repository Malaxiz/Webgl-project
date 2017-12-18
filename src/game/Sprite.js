// Sprite.js

export default class Sprite {
  constructor(src, info) {
    this.info = {
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
  }
}