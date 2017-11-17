import * as PIXI from 'pixi.js';

import Entity from './Entity';

export default class Game {
  constructor() {
    this.entities = [];
  }

  init(opts) {
    PIXI.utils.skipHello();

    let el = document.getElementById('ctx-container');
    let width = el.clientWidth;
    let height = el.clientHeight;

    let app = new PIXI.Application(width, height, {backgroundColor : 0x2f2f2f});
    app.stop();

    const rect = new PIXI.Graphics()
    .beginFill(0x00ff00)
    .drawRect(200, 200, 200, 200);

    app.stage.addChild(rect);

    // console.log(app.renderer.extract.pixels(rect));;;

    PIXI.loader.add('shader', 'shaders/first.frag')
    .load((loader, res) => {
      let uniforms = {
        time: {
          type: 'f',
          value: 0
        },
        mouse: {
          type: 'v2',
          value: { x: 0, y: 0 }
        }
      };

      let shader = new PIXI.Filter(null, res.shader.data, uniforms);
      rect.filters = [shader];
      app.ticker.add((d) => {
        shader.uniforms.time += 0.01;
      });

      app.start();
    });

    // Add a blur filter
    // rect.filters = [new PIXI.filters.BlurFilter(10)];

    // Display rectangle
    

    el.appendChild(app.view);
    this.app = app;
  }
}