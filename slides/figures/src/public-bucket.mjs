import { k, at, S, L, D, project, bench, label, knob, posts, writeFigure, HEIGHT } from "./common.mjs";

const BUCKET = [-18, -6];
const R = 34;
const BASE = 8;
const TOP = 80;
const LEFT = -68;
const RIGHT = 72;
const GATE_Y = -34;
const DIAL = [92, 44];

const P = project([
  [BUCKET[0], BUCKET[1], TOP + 6],
  [RIGHT, GATE_Y, 76],
  [DIAL[0] + 16, DIAL[1], 30],
]);

const bucket = () => {
  const out = [];
  out.push(S(k.slabOf({ x: -68, y: -50, w: 100, d: 92, r: 8 }, 0, BASE, P, 6, 1.2), { tone: "mid" }));
  out.push(S(k.cylinder(BUCKET[0], BUCKET[1], R + 3, BASE, 4, P, 48), { tone: "lo" }));
  out.push(S(k.cylinder(BUCKET[0], BUCKET[1], R, BASE + 4, TOP - BASE - 4, P, 48, 0.8), { tone: "mid" }));
  out.push(S(k.cylinder(BUCKET[0], BUCKET[1], R + 4, TOP - 6, 6, P, 48, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(BUCKET[0], BUCKET[1], R - 4, TOP, P, 48), { tone: "faint" }));
  const ticks = k.radialTicks(BUCKET[0], BUCKET[1], R + 1, 32, 4, TOP - 8, [1.2, 2.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  for (const z of [26, 52, 70]) {
    out.push(L(k.sideArc(BUCKET[0], BUCKET[1], R + 0.5, z, P, 40), { tone: "lo" }));
  }
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const x = BUCKET[0] + Math.cos(a) * (R + 0.8);
    const y = BUCKET[1] + Math.sin(a) * (R + 0.8);
    out.push(L(k.rise([x, y], BASE + 8, TOP - 12, P), { tone: "faint", free: "start" }));
  }
  out.push(D([at([BUCKET[0] - R + 8, BUCKET[1] + R - 9, TOP], P)], { size: 0.5, tone: "lit" }));
  return out.join("");
};

const shutter = (dx) => {
  const door = { x: -28, y: GATE_Y - 3, w: 56, d: 7, r: 2 };
  return `<g data-part="shutter" transform="${k.translateAlong(P, [dx, 0, 0])}">${[
    S(k.slabOf(door, 28, 34, P, 3, 0.6), { tone: "lit", crease: "lo" }),
    L(k.planOutline(k.insetPlan(door, 2.4), 62, P, 3), { tone: "faint" }),
    L(k.topTicks(-24, 20, 4, 5, GATE_Y - 1, 62.6, [1.8, 3], P).minor, { tone: "lo" }),
    L(k.topTicks(-24, 20, 4, 5, GATE_Y - 1, 62.6, [1.8, 3], P).major, { tone: "mid" }),
    S(k.cylinder(-19, GATE_Y, 2.6, 62, 5, P, 18), { tone: "mid" }),
    S(k.cylinder(19, GATE_Y, 2.6, 62, 5, P, 18), { tone: "mid" }),
    D([at([-19, GATE_Y, 67], P), at([19, GATE_Y, 67], P)], { size: 0.45 }),
  ].join("")}</g>`;
};

const collar = (dz) =>
  `<g data-part="collar" transform="${k.translateAlong(P, [0, 0, dz])}">${[
    S(k.cylinder(BUCKET[0], BUCKET[1], R + 6, TOP - 4, 3, P, 48), { tone: "hi" }),
    L(k.ring(BUCKET[0], BUCKET[1], R + 6, TOP - 1, P, 48), { tone: "mid" }),
    L(k.radialTicks(BUCKET[0], BUCKET[1], R + 4, 24, 4, TOP - 1, [1.4, 2.6], P).major, { tone: "lo" }),
    D([at([BUCKET[0] + R + 3, BUCKET[1], TOP - 1], P)], { size: 0.5, tone: "lit" }),
  ].join("")}</g>`;

const marker = (dx) =>
  `<g data-part="marker" transform="${k.translateAlong(P, [dx, 0, 0])}">${[
    S(k.slabOf({ x: 40, y: GATE_Y - 5, w: 12, d: 10, r: 2 }, 3, 6, P, 3, 0.4), { tone: "hi" }),
    S(k.cylinder(46, GATE_Y, 2.2, 9, 4, P, 16), { tone: "mid" }),
    D([at([46, GATE_Y, 13], P)], { size: 0.5, tone: "lit" }),
  ].join("")}</g>`;

const gaugeFace = (angle) => {
  const out = [];
  out.push(S(k.cylinder(DIAL[0], DIAL[1], 16, 16, 7, P, 40), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(DIAL[0], DIAL[1], 16, 19.6, 23, 42, P), { tone: "lo" }));
  const ticks = k.radialTicks(DIAL[0], DIAL[1], 13, 20, 5, 23, [1.2, 2.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.lineOnTop(
    [DIAL[0] - Math.sin(angle) * 2, DIAL[1] + Math.cos(angle) * 2],
    [DIAL[0] + Math.sin(angle) * 11, DIAL[1] - Math.cos(angle) * 11],
    23.2, P,
  ), { tone: "lit", free: "start" }));
  out.push(S(k.cylinder(DIAL[0], DIAL[1], 1.6, 23, 1.2, P, 16), { tone: "mid" }));
  return out.join("");
};

const scene = (state) => [
  bench(P),
  bucket(),
  posts(P, [[LEFT, GATE_Y], [RIGHT, GATE_Y]], 72),
  S(k.slabOf({ x: LEFT, y: GATE_Y - 9, w: RIGHT - LEFT, d: 18, r: 3 }, 2, 2, P, 3), { tone: "lo", crease: "none" }),
  shutter(state > 0.5 ? 0 : 52),
  collar(state > 0.5 ? -22 : 0),
  marker(state > 0.5 ? 42 : 0),
  label(P, { x: 44, y: 6, w: 58, d: 24, r: 3 }, 0, [0.9, 0.6, 0.8]),
  knob(P, -108, 44, 0, 8, 9),
  L(k.lineOnTop([-108, 44], [-100, 44], 10.4, P), { tone: "lit", free: "start" }),
  S(k.cylinder(DIAL[0], DIAL[1], 2.8, 0, 16, P, 20), { tone: "mid", crease: "none" }),
  gaugeFace(state > 0.5 ? 0.5 : -0.5),
].join("");

const posterText = `<text class="iso-face-text" data-tone="hi" x="26" y="34" font-size="15">PUBLIC BUCKET AND PERMISSION GATE</text><text class="iso-face-text" data-tone="mid" x="26" y="${HEIGHT - 24}" font-size="12">Private bucket · permission reduced</text>`;

const live = `
const P = ${JSON.stringify(P)};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const shutter = svg.querySelector('[data-part="shutter"]');
const collar = svg.querySelector('[data-part="collar"]');
const marker = svg.querySelector('[data-part="marker"]');
const readout = document.querySelector("[data-readout]");
const words = ["Before: public bucket · allUsers viewer", "After: private bucket · permission reduced"];
let value = 0, target = 0, frame = 0, last = 0, visible = false, idle = 0;
function draw() {
  shutter.setAttribute("transform", translateAlong(P, [(1 - value) * 52, 0, 0]));
  collar.setAttribute("transform", translateAlong(P, [0, 0, -value * 22]));
  marker.setAttribute("transform", translateAlong(P, [value * 42, 0, 0]));
  const text = words[value < 0.5 ? 0 : 1];
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(Math.round(value)));
  stage.setAttribute("aria-valuetext", text);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (Date.now() - idle > 4600) target = target < 0.5 ? 1 : 0;
  value += (target - value) * (1 - Math.exp(-dt / 0.26));
  if (Math.abs(target - value) < 0.004) value = target;
  draw();
  frame = visible && value !== target ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const steer = (next) => { target = next; idle = Date.now(); run(); };
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("click", () => steer(target < 0.5 ? 1 : 0));
stage.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); steer(1); }
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); steer(0); }
});
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  steer((event.clientX - box.left) / box.width > 0.52 ? 1 : 0);
});
draw();
`;

writeFigure({
  name: "public-bucket",
  fig: "Fig 2",
  title: "Bucket and permission",
  hint: "Move the pointer or press an arrow key",
  caption: "A sliding shutter over a bucket window. Before, the window is open to everyone and the marker passes; after, the shutter closes, the collar drops and the marker is held back.",
  keys: [
    { mark: "lit", label: "Shutter and marker: what changes with the fix" },
    { mark: "raised", label: "Bucket rim, ruler and permission gauge" },
  ],
  label: "A bucket with a sliding shutter. The shutter closes the access window, the collar drops, and the marker is held back when the permission is reduced.",
  readout: "Before: public bucket · allUsers viewer",
  P,
  art: scene(0),
  posterArt: scene(1) + posterText,
  live,
});
