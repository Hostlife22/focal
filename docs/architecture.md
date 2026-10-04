# Architecture and optical model

## Responsibilities

| Module                            | Responsibility                                                    |
| --------------------------------- | ----------------------------------------------------------------- |
| `src/main.tsx`                    | Mount React with StrictMode and load global CSS                   |
| `src/App.tsx`                     | Settings, presets, help, notifications and page composition       |
| `src/components/Slider.tsx`       | Shared native range input and displayed value                     |
| `src/components/OpticalScene.tsx` | Lens geometry, orbit controls, rays and focal plane               |
| `src/components/Viewfinder.tsx`   | Procedural scene, BokehPass, pointer focus and PNG download       |
| `src/lib/optics.ts`               | Settings types, defaults, presets and depth-of-field calculations |
| `src/lib/scene.ts`                | Shared GPU resource disposal and WebGL error message              |
| `src/styles.css`                  | Color/spacing tokens, layout, responsiveness and reduced motion   |

Settings flow down from App. Slider and viewfinder callbacks update the shared state; numeric results are derived from it. Renderer effects initialize once; refs give animation callbacks the latest settings without rebuilding scenes on each slider update. ResizeObservers update render size and camera aspect ratio. Cleanup cancels frames, disconnects observers, removes listeners/canvases and disposes GPU resources. Shared geometries/materials are disposed once per scene.

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
