const fragmentShader = `
precision mediump float;

uniform sampler2D uMap;
varying vec3 vNormal;
varying vec2 vUv;
uniform float opacity;

vec4 gammaCorrection(vec4 color) {
 return vec4(pow(color.rgb, vec3(1.0 / 2.2)), color.a); // Apply gamma correction to convert to linear color space
}

void main() {
 // Sample the texture color using the texture coordinates
 vec4 texColor = texture2D(uMap, vUv);

 // Apply gamma correction to the color output
 gl_FragColor = gammaCorrection(texColor * opacity);
}

`;

export default fragmentShader;
