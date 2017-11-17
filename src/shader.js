import './index.css';
import PIXI from './game/pixi.js';

// class Game {
//   constructor() {
//     this.ctx = this.initCtx(document.getElementById('ctx'));
//   }

//   initCtx(ctx) {
    

//     return ctx;
//   }
// }

// console.log(PIXI)

let shaderCode = `
precision mediump float;
uniform vec2      resolution;
uniform float     time;
uniform float     alpha;
uniform vec2      speed;
uniform float     shift;


float rand(vec2 n) {
  //This is just a compounded expression to simulate a random number based on a seed given as n
  	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
  //Uses the rand function to generate noise
	  const vec2 d = vec2(0.0, 1.0);
	  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
  //fbm stands for "Fractal Brownian Motion" https://en.wikipedia.org/wiki/Fractional_Brownian_motion
	  float total = 0.0, amplitude = 1.0;
	  for (int i = 0; i < 4; i++) {
 	   total += noise(n) * amplitude;
	    n += n;
	    amplitude *= 0.5;
	  }
	  return total;
}

void main() {
    //This is where our shader comes together
    const vec3 c1 = vec3(126.0/255.0, 0.0/255.0, 97.0/255.0);
    const vec3 c2 = vec3(173.0/255.0, 0.0/255.0, 161.4/255.0);
    const vec3 c3 = vec3(0.2, 0.0, 0.0);
    const vec3 c4 = vec3(164.0/255.0, 1.0/255.0, 214.4/255.0);
    const vec3 c5 = vec3(0.1);
    const vec3 c6 = vec3(0.9);

    //This is how "packed" the smoke is in our area. Try changing 8.0 to 1.0, or something else
    vec2 p = gl_FragCoord.xy * 8.0 / resolution.xx;
    //The fbm function takes p as its seed (so each pixel looks different) and time (so it shifts over time)
    float q = fbm(p - time * 0.1);
    vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));
    vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
    float grad = gl_FragCoord.y / resolution.y;
    gl_FragColor = vec4(c * cos(shift * gl_FragCoord.y / resolution.y), 1.0);
    gl_FragColor.xyz *= 1.0-grad;
}
`;

//Adapted from: https://codepen.io/davidhartley/pen/seEki?editors=0010

var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new PIXI.autoDetectRenderer(width, height);//Chooses either WebGL if supported or falls back to Canvas rendering
document.body.appendChild(renderer.view);//Add the render view object into the page

var stage = new PIXI.Container();//The stage is the root container that will hold everything in our scene

// smoke shader
var uniforms = {};
uniforms.resolution = { type: 'v2', value: { x: width, y: height}};
uniforms.alpha = { type: '1f', value: 1.0};
uniforms.shift = { type: '1f', value: 1.6};
uniforms.time = {type: '1f',value: 0};
uniforms.speed = {type: 'v2', value: {x: 0.7, y: 0.4}};


// var shaderCode = document.getElementById( 'fragShader' ).innerHTML
var smokeShader = new PIXI.AbstractFilter('',shaderCode, uniforms);

var bg = PIXI.Sprite.fromImage("http://www.goodboydigital.com/pixijs/pixi_v3_github-pad.png");
bg.width = width;
bg.height = height;
bg.filters = [smokeShader]
stage.addChild(bg);
console.log(bg)

// var logo = PIXI.Sprite.fromImage("http://www.goodboydigital.com/pixijs/pixi_v3_github-pad.png");
// logo.x = width / 2;
// logo.y = height / 2;
// logo.anchor.set(0.5);
// logo.blendMode = PIXI.BLEND_MODES.ADD;
// stage.addChild(logo)

animate()


var count = 0

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    count+=0.01
    smokeShader.uniforms.time.value = count;

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}