const fragmentShader = `
precision mediump float;

uniform sampler2D uMap;
uniform float uShouldFadeBitcoin;
varying vec3 vNormal;
varying vec2 vUv;

vec4 gammaCorrection(vec4 color) {
 return vec4(pow(color.rgb, vec3(1.0 / 2.2)), color.a); // Apply gamma correction to convert to linear color space
}

void main() {
 // Sample the texture color using the texture coordinates
 vec4 texColor = texture2D(uMap, vUv);

 if (texColor.a > 0.0) {
     
 if (uShouldFadeBitcoin > 0.5) {
     // Apply 0.3 opacity to the entire left half and 1.0 to the right half
         texColor.a *= 0.00;
     
 }
} else {
    discard; // Discard transparent fragments to ensure they stay invisible
 }
 // Apply gamma correction to the color output
 gl_FragColor = gammaCorrection(texColor);
}

`;

export default fragmentShader;
