precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform float time;

void main() {
  vec2 uv = gl_FragCoord.xy;

  if (v_texcoord.x < 0.0 ||
      v_texcoord.y < 0.0 ||
      v_texcoord.x > 1.0 ||
      v_texcoord.y > 1.0) {
    discard;
  }

  float alpha = 4.0*texture2D( u_texture, v_texcoord ).a;
  alpha -= texture2D( u_texture, v_texcoord + vec2( 0.001, 0.0 ) ).a;
  alpha -= texture2D( u_texture, v_texcoord + vec2( -0.001, 0.0 ) ).a;
  alpha -= texture2D( u_texture, v_texcoord + vec2( 0.0, 0.001 ) ).a;
  alpha -= texture2D( u_texture, v_texcoord + vec2( 0.0, -0.001 ) ).a;

  vec4 fragColor = vec4(1.0, 1.0, 1.0, alpha);

  gl_FragColor = fragColor;
}