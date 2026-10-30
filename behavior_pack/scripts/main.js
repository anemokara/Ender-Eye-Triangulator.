import { world } from "@minecraft/server";
import {
  rotationToDirection,
  triangulateTarget
} from "./triangulator.js";

const observations = new Map();

function saveObservation(player, position, yaw, pitch) {
  const direction = rotationToDirection(yaw, pitch);
  const playerObservations = observations.get(player.id) ?? [];
  const updated = [...playerObservations, { position, direction }].slice(-2);

  observations.set(player.id, updated);
  return updated;
}

function handleEnderEyeObservation(event) {
  const source = event.source;
  const stack = event.itemStack ?? event.item;

  if (!source || source.typeId !== "minecraft:player") {
    return;
  }

  if (!stack || stack.typeId !== "minecraft:ender_eye") {
    return;
  }

  const rotation = source.getRotation?.() ?? { x: 0, y: 0 };
  const yaw = Number(rotation.x ?? 0);
  const pitch = Number(rotation.y ?? 0);
  const position = source.getHeadLocation?.() ?? source.location ?? { x: 0, y: 0, z: 0 };
  const savedObservations = saveObservation(source, position, yaw, pitch);

  if (savedObservations.length < 2) {
    source.sendMessage("First Ender Eye sample recorded. One more sample is needed to triangulate the target.");
    return;
  }

  const [firstSample, secondSample] = savedObservations;
  const target = triangulateTarget(
    firstSample.position,
    firstSample.direction,
    secondSample.position,
    secondSample.direction
  );

  source.sendMessage(
    `Triangulated target: ${target.x.toFixed(1)}, ${target.y.toFixed(1)}, ${target.z.toFixed(1)}`
  );
  observations.delete(source.id);
}

for (const eventName of ["itemUse", "itemUseOn"]) {
  const eventGroup = world.afterEvents?.[eventName];
  if (typeof eventGroup?.subscribe === "function") {
    eventGroup.subscribe((event) => {
      handleEnderEyeObservation(event);
    });
  }
}
