/**
 * Fixed 3D positions for each workstation, matching the requested office
 * layout (AVA at the back, ORION centered as the command-center hub, FIN/
 * GUARD at the front). Presentation-only data — no business logic here, per
 * the rule that Three.js components must not contain business logic.
 */
export const OFFICE_POSITIONS: Record<string, [number, number, number]> = {
  ava: [0, 0.6, -8],
  spark: [-5, 0.6, -4.5],
  milo: [5, 0.6, -4.5],
  orion: [0, 0.6, -1],
  luna: [-5, 0.6, 2.5],
  echo: [5, 0.6, 2.5],
  nova: [0, 0.6, 6],
  fin: [-2.6, 0.6, 9],
  guard: [2.6, 0.6, 9]
};
