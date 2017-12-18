// Camera.js

export default class Camera {
  constructor() {
    this.box = [0, 0];

    this.target;
  }

  update(delta) {
    if(!this.target) return;
    let target = this.target.box;

    for(let i in this.box) {
      let d = ((~-(target[i] - this.box[i]) / 1000) * 100);
      this.box[i] += (d < -1 || d > 1) ? ~-d : 0;
    }
  }
}