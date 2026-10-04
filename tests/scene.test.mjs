import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { disposeScene } from '../src/lib/scene.ts';

test('scene cleanup disposes geometry and shared materials once across meshes and lines', () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial();
  let geometryDisposals = 0;
  let materialDisposals = 0;
  geometry.addEventListener('dispose', () => geometryDisposals++);
  material.addEventListener('dispose', () => materialDisposals++);
  scene.add(new THREE.Mesh(geometry, material));
  scene.add(new THREE.Mesh(geometry, [material, material]));
  scene.add(new THREE.Line(geometry, material));
  disposeScene(scene);
  assert.equal(geometryDisposals, 1);
  assert.equal(materialDisposals, 1);
});
