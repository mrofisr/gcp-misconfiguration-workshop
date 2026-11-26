import {
  WIDTH, HEIGHT, k, at, S, L, D, project, bench, label, knob, posts, writeFigure,
} from "./common.mjs";

const BUCKET = [-62, -4];
const R = 30;
const BASE_Z = 8;
const TOP_Z = 74;
const GATE_LEFT = 32;
const GATE_RIGHT = 108;
const GATE_Y = -30;
const DIAL = [98, 46];

const P = project([
  [BUCKET[0], BUCKET[1], TOP_Z + 4],
  [GATE_RIGHT, GATE_Y, 78],
  [DIAL[0] + 18, DIAL[1], 28],
]);

const bucket = () => {
  const out = [];
  out.push(S(k.slabOf({ x: -102, y: -46, w: 80, d: 84, r: 7 }, 0, BASE_Z, P, 6, 1.2), { tone: "mid" }));
  out.push(S(k.cylinder(BUCKET[0], BUCKET[1], R + 2, BASE_Z, 3, P, 48), { tone: "lo" }));
  out.push(S(k.cylinder(BUCKET[0], BUCKET[1], R, BASE_Z + 3, TOP_Z - BASE_Z - 3, P, 48, 0.8), { tone: "mid" }));
  out.push(S(k.cylinder(BUCKET[0], BUCKET[1], R + 3, TOP_Z - 5, 5, P, 48, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(BUCKET[0], BUCKET[1], R - 3, TOP_Z, P, 48), { tone: "faint" }));
  const ribs = k.radialTicks(BUCKET[0], BUCKET[1], R + 1.2, 24, 3, TOP_Z - 7, [1.2, 2.4], P);
  out.push(L(ribs.minor, { tone: "lo" }), L(ribs.major, { tone: "mid" }));
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const x = BUCKET[0] + Math.cos(a) * (R + 0.6);
    const y = BUCKET[1] + Math.sin(a) * (R + 0.6);
    out.push(L(k.rise([x, y], BASE_Z + 6, TOP_Z - 10, P), { tone: "faint", free: "start" }));
  }
  out.push(D([at([BUCKET[0] - R + 5, BUCKET[1] + R - 7, TOP_Z], P)], { size: 0.5, tone: "lit" }));
  out.push(L(k.sideArc(BUCKET[0], BUCKET[1], R + 3, TOP_Z - 2.5, P, 32), { tone: "lo" }));
  return out.join("");
};

const gate = (dz) => {
  const arm = { x: GATE_LEFT + 1, y: GATE_Y - 4, w: GATE_RIGHT - GATE_LEFT - 2, d: 8, r: 2 };
  return `<g data-part="gate" transform="${k.translateAlong(P, [0, 0, dz])}">${[
    S(k.slabOf(arm, 40, 4, P, 3, 0.5), { tone: "lit", crease: "lo" }),
    L(k.planOutline(k.insetPlan(arm, 2), 44, P, 3), { tone: "faint" }),
    S(k.cylinder(GATE_LEFT + 8, GATE_Y, 2.4, 44, 8, P, 18), { tone: "mid" }),
    S(k.cylinder(GATE_RIGHT - 8, GATE_Y, 2.4, 44, 8, P, 18), { tone: "mid" }),
    D([GATE_LEFT + 8, GATE_RIGHT - 8].map((x) => at([x, GATE_Y, 52], P)), { size: 0.45 }),
  ].join("")}</g>`;
};

const visitor = (dx) =>
  `<g data-part="visitor" transform="${k.translateAlong(P, [dx, 0, 0])}">${[
    S(k.slabOf({ x: 8, y: GATE_Y - 6, w: 14, d: 12, r: 2 }, 4, 7, P, 3, 0.4), { tone: "hi" }),
    L(k.planOutline(k.insetPlan({ x: 8, y: GATE_Y - 6, w: 14, d: 12, r: 2 }, 1.6), 11, P, 3), { tone: "faint" }),
    S(k.cylinder(15, GATE_Y, 2, 11, 5, P, 16), { tone: "mid" }),
    D([at([15, GATE_Y, 16], P)], { size: 0.5, tone: "lit" }),
  ].join("")}</g>`;

const scene = (state) => [
  bench(P),
  bucket(),
  posts(P, [[GATE_LEFT, GATE_Y], [GATE_RIGHT, GATE_Y]], 60),
  gate(state > 0.5 ? -18 : 18),
  S(k.slabOf({ x: 6, y: GATE_Y - 10, w: GATE_RIGHT - 2, d: 20, r: 3 }, 2, 2, P, 3), { tone: "lo", crease: "none" }),
  visitor(state > 0.5 ? 0 : 52),
  label(P, { x: 36, y: 2, w: 56, d: 24, r: 3 }, 0, [0.9, 0.7, 0.8]),
  knob(P, -112, 40, 0, 8, 9),
  L(k.lineOnTop([-112, 40], [-104, 40], 10.4, P), { tone: "lit", free: "start" }),
  S(k.cylinder(DIAL[0], DIAL[1], 2.8, 0, 16, P, 20), { tone: "mid", crease: "none" }),
  gaugeFace(),
].join("");

function gaugeFace() {
  const out = [];
  out.push(S(k.cylinder(DIAL[0], DIAL[1], 15, 16, 7, P, 40), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(DIAL[0], DIAL[1], 15, 19.6, 23, 40, P), { tone: "lo" }));
  const ticks = k.radialTicks(DIAL[0], DIAL[1], 12, 16, 4, 23, [1.2, 2.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  const angle = -0.45;
  out.push(L(k.lineOnTop(
    [DIAL[0] - Math.sin(angle) * 2, DIAL[1] + Math.cos(angle) * 2],
    [DIAL[0] + Math.sin(angle) * 12, DIAL[1] - Math.cos(angle) * 12],
    23.2, P,
  ), { tone: "lit", free: "start" }));
  out.push(S(k.cylinder(DIAL[0], DIAL[1], 1.6, 23, 1.2, P, 16), { tone: "mid" }));
  return out.join("");
}

const posterText = `<text class="iso-face-text" data-tone="hi" x="26" y="34" font-size="15">BUCKET + IAM GUEST LIST</text><text class="iso-face-text" data-tone="mid" x="26" y="${HEIGHT - 24}" font-size="12">Guest list: team only · Bucket: gated</text>`;

const live = `
const P = ${JSON.stringify(P)};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const gate = svg.querySelector('[data-part="gate"]');
const visitor = svg.querySelector('[data-part="visitor"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const words = ["Guest list: open to all · Bucket: accessible", "Guest list: team only · Bucket: gated"];
let value = 0, target = 0, frame = 0, last = 0, visible = false, idle = 0;
function draw() {
  gate.setAttribute("transform", translateAlong(P, [0, 0, 18 - value * 36]));
  visitor.setAttribute("transform", translateAlong(P, [(1 - value) * 52, 0, 0]));
  const text = words[value < 0.5 ? 0 : 1];
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(Math.round(value)));
  stage.setAttribute("aria-valuetext", text);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (!still && Date.now() - idle > 4200) target = target < 0.5 ? 1 : 0;
  value += (target - value) * (1 - Math.exp(-dt / 0.24));
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
  name: "bucket-iam",
  fig: "Fig 1",
  title: "Bucket and guest list",
  hint: "Move the pointer or press an arrow key",
  caption: "A bucket on a bench and a gate with a guest list. When the list is open to all, the gate lifts and a visitor passes; when the list is restricted, the gate drops and the visitor stops.",
  keys: [
    { mark: "lit", label: "Gate arm and visitor: what changes with the list" },
    { mark: "raised", label: "Bucket rim, ruler and guest-list plate" },
  ],
  label: "A bucket and a guest-list gate. The gate arm lifts or drops with the access list, and the visitor token passes or stops.",
  readout: "Guest list: open to all · Bucket: accessible",
  P,
  art: scene(0),
  posterArt: scene(1) + posterText,
  live,
});
