# Architecture and optical model

## Responsibilities

| Module                                                         | Responsibility                                                              |
| -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `src/App.tsx`                                                  | Compose the page and connect state to panels                                |
| `src/state/labReducer.ts`                                      | Pure, typed transitions for settings, presets, views and request counters   |
| `src/hooks/useCameraLab.ts`                                    | React adapter and actions for the lab reducer                               |
| `src/hooks/useNotice.ts`                                       | Notification lifetime, including repeated messages                          |
| `src/components/lab/`                                          | Lens explorer, controls, preview, depth results and presets                 |
| `src/components/layout/`                                       | Site header, heading and footer                                             |
| `src/components/ui/`                                           | Shared panel header, help dialog and toast                                  |
| `src/components/Slider.tsx`                                    | Native range input and displayed value                                      |
| `src/components/OpticalScene.tsx`, `Viewfinder.tsx`            | Canvas hosts and accessible overlays                                        |
| `src/hooks/useSceneController.ts`                              | Mount, update and dispose controllers from committed React state            |
| `src/scenes/createOpticalScene.ts`, `createViewfinderScene.ts` | Camera, interaction, rendering and resource ownership                       |
| `src/scenes/opticalModel.ts`, `viewfinderModel.ts`             | Procedural geometry and lens visualization updates                          |
| `src/scenes/runtime.ts`                                        | Renderer creation, resize observation, animation loop and snapshot download |
| `src/lib/optics.ts`                                            | Domain types, ranges, defaults, presets and depth-of-field calculation      |
| `src/lib/scene.ts`                                             | Shared GPU disposal and WebGL fallback                                      |
| `src/styles/`                                                  | Tokens, shared panels, component styles and responsive overrides            |

State flows through explicit callbacks; no global store or context is needed. The reducer owns coupled transitions: changing separation opens the lens assembly, applying a preset copies only optical fields, and reset preserves the capture counter to avoid accidental downloads.

React scene hosts mount controllers once. State updates reach controllers through effects, without recreating WebGL contexts. The optical explorer keeps an animation loop for OrbitControls damping. The static viewfinder renders only on settings changes or resize. Snapshot notifications follow successful PNG creation.

Controllers own their canvases, input listeners, resize observers and GPU resources. Cleanup stops animation, disconnects observers, removes listeners, disposes geometries/materials and all postprocessing passes, then removes the canvas. The shared hook supports StrictMode setup/cleanup cycles. Ray updates reuse existing geometry buffers.

The stylesheet entry imports modules in cascade order. Component classes and responsive behavior remain compatible with the original layout.

## Units and calculations

Focal length `f` is in millimeters, aperture `N` is dimensionless and focus distance is stored in meters, then converted to millimeters as `s`. Circle of confusion `c` is fixed at 0.03 mm.

```text
H = f² / (N × c) + f
near = H × s / (H + s − f)
far = H × s / (H − s + f), or infinity when H ≤ s − f
```

Results are converted back to meters. Total depth is `far − near`. These equations approximate acceptable sharpness using a thin lens; they are not a ray-traced model of the illustrated six elements. The 0.03 mm threshold is an assumption, not a universal definition of sharpness.

The viewfinder derives vertical field of view from a 24 mm sensor height and selected focal length. BokehPass uses focus distance and an artistic aperture mapping. Separation, exploded view, ray visibility and focal-plane visibility affect the lens illustration only.

## Assets and dependencies

Lens and scene meshes are procedural Three.js geometry. No external models, images or textures are required. React renders the surrounding interface; Lucide supplies icons. Google Fonts supplies DM Sans and Manrope with CSS fallbacks. Original project code uses MIT; installed dependencies and externally served fonts retain their own licenses.
