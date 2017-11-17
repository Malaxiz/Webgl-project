precision mediump float;
uniform vec2 mouse;
uniform float time;

void main() {
  gl_FragColor = vec4(sin(time), mouse.x, mouse.y, 0.5);
}