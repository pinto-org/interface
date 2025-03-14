// vertex shader

const vertexShader = `
uniform float uProgress;
uniform float uAnimationPhase;
attribute vec2 aAnimation;
attribute vec3 aStartPosition;
attribute vec3 aControl0;
attribute vec3 aControl1;
attribute vec3 aEndPosition;
varying vec2 vUv;
varying vec3 vNormal;

vec3 cubicBezier(vec3 p0, vec3 c0, vec3 c1, vec3 p1, float t) {
  float tn = 1.0 - t;
  return tn * tn * tn * p0 + 2.5 * tn * tn * t * c0 + 2.5 * tn * t * t * c1 + t * t * t * p1;
}

float easeInOutCubic(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal); 

  float tDelay = aAnimation.x;
  float tDuration = aAnimation.y;
  float tTime = clamp(uProgress - tDelay, 0.0, tDuration);
  float tProgress = tTime / tDuration;
  tProgress = easeInOutCubic(tProgress);

  vec3 newPosition = position;

  if (uAnimationPhase == 1.0) {
    newPosition *= tProgress;
  } else {
    newPosition *= (1.0 - tProgress);
  }

  newPosition += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export default vertexShader;
