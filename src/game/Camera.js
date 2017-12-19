// Camera.js

export default class Camera {
  constructor() {
    this.box = [0, 0, 0, 0];

    this.target;
  }

  update() {
    if(!this.target) return;
    let target = this.target.box;

    for(let i in [0,1]) {
      let d = ((~-(target[i] - this.box[i])) / 10);
      this.box[i] += (d < -1 || d > 1) ? ~-d : 0;
    }
  }
}