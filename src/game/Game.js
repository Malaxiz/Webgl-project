import * as PIXI from 'pixi.js';

import Entity from './Entity';

export default class Game {
  constructor() {
    this.entities = [];
  }

  init(opts) {
    let el = document.getElementById('ctx-container');
    let width = el.clientWidth;
    let height = el.clientHeight;

    this.app = new PIXI.Application(width, height, {backgroundColor : 0x2f2f2f});

    const rect = new PIXI.Graphics()
    .beginFill(0x00ff00)
    .drawRect(200, 200, 200, 200);

    // Add a blur filter
    rect.filters = [new PIXI.filters.BlurFilter(10)];

    // Display rectangle
    this.app.stage.addChild(rect);

    el.appendChild(this.app.view);
  }
}