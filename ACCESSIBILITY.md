# Accessibility

Focal aims to make its controls and numeric optical results usable with a keyboard and assistive technology. This document describes implementation and known gaps; it is not a WCAG conformance claim or an independent audit.

## Implemented support

- English document language, semantic headings and a skip link to the lab.
- Native labeled range inputs for focus, aperture, focal length and separation.
- Named icon buttons, pressed states for viewpoint/exploded controls and switch states for rays and the focal plane.
- Visible keyboard focus indicators and a status region for notifications.
- Help dialog with an accessible name, initial focus on Close, Escape dismissal, focus containment and focus restoration to the trigger.
- Reduced-motion CSS disables UI transitions. Rendering loops still run; the scenes do not automatically orbit.
- WebGL failure messages leave sliders and numeric calculations available.

Use Tab/Shift+Tab to navigate, arrow keys to adjust focused sliders and Space/Enter to activate buttons. The focus-distance slider is the alternative to pointer-based viewfinder focus. Viewpoint buttons provide fixed alternatives to dragging the 3D lens.

## Known limitations

The canvas descriptions cannot communicate the full 3D image or depth-of-field effect to a screen reader. Orbiting and selecting a specific rendered object require a pointer; the numerical controls do not reproduce every spatial operation. The depth diagram has no complete textual description of its spatial arrangement, although near/far/total values are displayed nearby.

Small secondary labels, zoom/reflow, color contrast and touch targets need further auditing across devices. Automated checks alone cannot establish accessibility. Screen reader testing with NVDA, VoiceOver and TalkBack has not been completed.

## Verification and feedback

Follow the keyboard, reduced-motion, zoom and WebGL checks in [validation](docs/validation.md). Report barriers through [GitHub Issues](https://github.com/Hostlife22/focal/issues), including browser, assistive technology, steps and the task you could not complete. Screenshots are optional; a text description is sufficient.
