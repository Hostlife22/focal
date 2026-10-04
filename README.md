# Focal — interactive camera lab

A responsive, interactive optics playground built with React, strict TypeScript, Vite, and Three.js.

## Run

```sh
npm install
npm run dev
```

## Quality checks

```sh
npm run check
npm run build
```

`npm run format` formats the project. ESLint uses flat configuration, type-aware TypeScript rules, React Hooks rules, and Prettier compatibility. TypeScript enables strict mode and checked indexed access. Dependencies are pinned by `package-lock.json`.

## Explore

- Orbit and zoom a six-element 3D lens. Switch between perspective, side, and front views.
- Adjust focus distance, aperture, focal length, and lens element separation.
- Show or hide light rays and the focal plane; assemble or explode the lens.
- Click an object in the live WebGL viewfinder to focus. Depth of field is rendered using Three.js BokehPass.
- Try portrait, street, and landscape presets. Capture downloads the current viewfinder as a PNG.
- Reset restores the starting configuration. Help explains the controls.

Depth-of-field limits are calculated with the thin-lens model using a 0.03 mm circle of confusion for full-frame sensors. The exploded assembly and ray paths are educational illustrations, not a physically traced compound lens. Element separation affects the diagram, not the viewfinder optics. The viewfinder is a procedural scene and needs no external assets. WebGL and hardware acceleration are required for the 3D views.

Focus range: 0.5–10 m. Responsive layouts support phones and desktops. Controls support keyboard navigation; reduced-motion settings disable UI transitions. Google Fonts fall back to system fonts when unavailable.
