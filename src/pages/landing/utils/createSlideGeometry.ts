import * as THREE from "three";

export const createSlideGeometry = (width, height, animationPhase, onMaxAnimationTimeCalculated) => {
  {
    const plane = new THREE.PlaneGeometry(width, height, width * 2, height * 2);

    let maxAnimationTime = 0.3;

    // Convert to non-indexed geometry
    const nonIndexedPlane = plane.toNonIndexed();

    const positionAttribute = nonIndexedPlane.attributes.position;
    const positions = positionAttribute.array as Float32Array;
    const vertexCount = positionAttribute.count;
    const faceCount = vertexCount / 3;

    const aAnimation = new Float32Array(vertexCount * 2);
    const aStartPosition = new Float32Array(vertexCount * 3);
    const aControl0 = new Float32Array(vertexCount * 3);
    const aControl1 = new Float32Array(vertexCount * 3);
    const aEndPosition = new Float32Array(vertexCount * 3);

    const minDuration = 0.3;
    const maxDuration = 0.7;
    const maxDelayX = 0.2999;
    const maxDelayY = 0.0;
    const stretch = 0.15;

    const startPosition = new THREE.Vector3();
    const control0 = new THREE.Vector3();
    const control1 = new THREE.Vector3();
    const endPosition = new THREE.Vector3();

    // Adjust positions by subtracting centroid
    for (let f = 0; f < faceCount; f++) {
      const faceOffset = f * 3;
      const a = new THREE.Vector3(
        positions[(faceOffset + 0) * 3],
        positions[(faceOffset + 0) * 3 + 1],
        positions[(faceOffset + 0) * 3 + 2],
      );
      const b = new THREE.Vector3(
        positions[(faceOffset + 1) * 3],
        positions[(faceOffset + 1) * 3 + 1],
        positions[(faceOffset + 1) * 3 + 2],
      );
      const c = new THREE.Vector3(
        positions[(faceOffset + 2) * 3],
        positions[(faceOffset + 2) * 3 + 1],
        positions[(faceOffset + 2) * 3 + 2],
      );
      const centroid = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3);

      // Adjust positions to be centered around the centroid
      for (let v = 0; v < 3; v++) {
        positions[(faceOffset + v) * 3] -= centroid.x;
        positions[(faceOffset + v) * 3 + 1] -= centroid.y;
        positions[(faceOffset + v) * 3 + 2] -= centroid.z;
      }

      // Animation timings
      const duration = THREE.MathUtils.randFloat(minDuration, maxDuration);

      const delayX = THREE.MathUtils.mapLinear(centroid.x, -width * 0.5, width * 0.5, 0.0, maxDelayX);
      const delayY =
        animationPhase === "in"
          ? THREE.MathUtils.mapLinear(Math.abs(centroid.y), 0, height * 0.5, 0.0, maxDelayY)
          : THREE.MathUtils.mapLinear(Math.abs(centroid.y), 0, height * 0.5, maxDelayY, 0.0);

      let tDelay = delayX + delayY * stretch * duration;
      let tDuration = duration;

      // Ensure tDelay + tDuration ≤ 1
      if (tDelay + tDuration > 0.3) {
        const excessTime = tDelay + tDuration - 1;
        tDelay -= (tDelay / (tDelay + tDuration)) * excessTime;
        tDuration -= (tDuration / (tDelay + tDuration)) * excessTime;
      }

      // Track the maximum animation time
      if (tDelay + tDuration > maxAnimationTime) {
        maxAnimationTime = tDelay + tDuration;
      }

      for (let v = 0; v < 3; v++) {
        const vIndex = faceOffset + v;
        aAnimation[vIndex * 2] = delayX + delayY + Math.random() * stretch * duration;
        aAnimation[vIndex * 2 + 1] = duration;
      }

      // Call the callback with the maximum animation time
      if (onMaxAnimationTimeCalculated) {
        onMaxAnimationTimeCalculated(maxAnimationTime);
      }

      // Positions
      endPosition.copy(centroid);
      startPosition.copy(centroid);

      if (animationPhase === "in") {
        control0.copy(centroid).sub(getControlPoint0(centroid));
        control1.copy(centroid).sub(getControlPoint1(centroid));
      } else {
        control0.copy(centroid).add(getControlPoint0(centroid));
        control1.copy(centroid).add(getControlPoint1(centroid));
      }

      for (let v = 0; v < 3; v++) {
        const vIndex = faceOffset + v;
        aStartPosition.set([startPosition.x, startPosition.y, startPosition.z], vIndex * 3);
        aControl0.set([control0.x, control0.y, control0.z], vIndex * 3);
        aControl1.set([control1.x, control1.y, control1.z], vIndex * 3);
        aEndPosition.set([endPosition.x, endPosition.y, endPosition.z], vIndex * 3);
      }
    }

    positionAttribute.needsUpdate = true;

    nonIndexedPlane.setAttribute("aAnimation", new THREE.BufferAttribute(aAnimation, 2));
    nonIndexedPlane.setAttribute("aStartPosition", new THREE.BufferAttribute(aStartPosition, 3));
    nonIndexedPlane.setAttribute("aControl0", new THREE.BufferAttribute(aControl0, 3));
    nonIndexedPlane.setAttribute("aControl1", new THREE.BufferAttribute(aControl1, 3));
    nonIndexedPlane.setAttribute("aEndPosition", new THREE.BufferAttribute(aEndPosition, 3));

    return nonIndexedPlane;
  }
};

function getControlPoint0(centroid: THREE.Vector3) {
  const signY = Math.sign(centroid.y);
  return new THREE.Vector3(
    THREE.MathUtils.randFloat(0.1, 0.3) * 50,
    signY * THREE.MathUtils.randFloat(0.1, 0.3) * 70,
    THREE.MathUtils.randFloatSpread(20),
  );
}

function getControlPoint1(centroid: THREE.Vector3) {
  const signY = Math.sign(centroid.y);
  return new THREE.Vector3(
    THREE.MathUtils.randFloat(0.3, 0.6) * 50,
    -signY * THREE.MathUtils.randFloat(0.3, 0.6) * 70,
    THREE.MathUtils.randFloatSpread(20),
  );
}
