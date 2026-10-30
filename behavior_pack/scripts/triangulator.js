export function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z
  };
}

export function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
  };
}

export function scale(vector, scalar) {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar,
    z: vector.z * scalar
  };
}

export function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

export function normalizeVector(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1e-12;

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
}

export function rotationToDirection(yaw, pitch) {
  const yawRadians = (yaw * Math.PI) / 180;
  const pitchRadians = (pitch * Math.PI) / 180;
  const cosinePitch = Math.cos(pitchRadians);

  return normalizeVector({
    x: -Math.sin(yawRadians) * cosinePitch,
    y: Math.sin(pitchRadians),
    z: Math.cos(yawRadians) * cosinePitch
  });
}

export function directionToRotation(direction) {
  const normalized = normalizeVector(direction);
  const horizontal = Math.hypot(normalized.x, normalized.z) || 1e-12;

  return {
    yaw: ((Math.atan2(-normalized.x, normalized.z) * 180) / Math.PI + 360) % 360,
    pitch: (Math.atan2(normalized.y, horizontal) * 180) / Math.PI
  };
}

export function triangulateTarget(originA, directionA, originB, directionB) {
  const dirA = normalizeVector(directionA);
  const dirB = normalizeVector(directionB);
  const difference = subtract(originB, originA);
  const lineCross = cross(dirA, dirB);
  const denominator = dot(lineCross, lineCross);

  if (denominator < 1e-9) {
    return {
      x: (originA.x + originB.x) / 2,
      y: (originA.y + originB.y) / 2,
      z: (originA.z + originB.z) / 2
    };
  }

  const parameterA = dot(difference, cross(dirB, lineCross)) / denominator;
  const intersection = add(originA, scale(dirA, parameterA));

  return {
    x: Number(intersection.x.toFixed(4)),
    y: Number(intersection.y.toFixed(4)),
    z: Number(intersection.z.toFixed(4))
  };
}

export function triangulateByYawPitch(observerA, observerB) {
  return triangulateTarget(
    observerA.position,
    rotationToDirection(observerA.yaw, observerA.pitch),
    observerB.position,
    rotationToDirection(observerB.yaw, observerB.pitch)
  );
}
