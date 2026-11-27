import { k, at, S, L, D, project, bench, label, knob, posts, writeFigure, HEIGHT } from "./common.mjs";

const SAFE = { x: -102, y: -52, w: 92, d: 76, r: 7 };
const SAFE_TOP = 46;
const HOOK = [-110, 46];
const GATE_L = 20;
const GATE_R = 108;
const GATE_Y = -28;
const DIAL = [-54, -14];
const DIAL_TOP = 58;

const P = project([
  [SAFE.x + SAFE.w, SAFE.y, SAFE_TOP + 12],
  [GATE_R, GATE_Y, 76],
  [DIAL[0], DIAL[1], DIAL_TOP + 4],
]);

const safe = () => {
  const out = [];
  out.push(S(k.slabOf(SAFE, 0, SAFE_TOP, P, 7, 1.6), { tone: "mid" }));
  out.push(L(k.sideSeam(SAFE, SAFE_TOP - 6, P), { tone: "faint" }));
  out.push(S(k.slabOf(k.insetPlan(SAFE, 3), SAFE_TOP, 6, P, 7, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(SAFE, 8), SAFE_TOP + 6, P, 7), { tone: "faint" }));
  const bolts = k.corners(SAFE, 10);
  out.push(L(bolts.map(([x, y]) => k.ring(x, y, 2, SAFE_TOP + 6, P, 14)).join(""), { tone: "lo" }));
  out.push(D(bolts.map(([x, y]) => at([x, y, SAFE_TOP + 6], P)), { size: 0.5 }));
  const ticks = k.topTicks(-92, -20, 4, 5, SAFE.y + SAFE.d - 10, SAFE_TOP + 6.4, [1.6, 3], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(S(k.cylinder(DIAL[0], DIAL[1], 2.6, SAFE_TOP + 6, 6, P, 20), { tone: "mid" }));
  return out.join("");
};

const dial = () => {
  const out = [];
  out.push(S(k.cylinder(DIAL[0], DIAL[1], 18, SAFE_TOP + 6, 6, P, 44), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(DIAL[0], DIAL[1], 18, SAFE_TOP + 9, DIAL_TOP, 48, P), { tone: "lo" }));
  const ticks = k.radialTicks(DIAL[0], DIAL[1], 15, 24, 4, DIAL_TOP, [1.2, 2.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.lineOnTop([DIAL[0] - 6, DIAL[1]], [DIAL[0] + 6, DIAL[1]], DIAL_TOP + 0.2, P), { tone: "lit", free: "start" }));
  out.push(S(k.cylinder(DIAL[0], DIAL[1], 2, DIAL_TOP, 1.2, P, 16), { tone: "mid" }));
  out.push(S(k.slabOf({ x: DIAL[0] - 3, y: DIAL[1] + 20, w: 6, d: 14, r: 2 }, SAFE_TOP + 6, 4, P, 3), { tone: "mid" }));
  return out.join("");
};

const key = (dx) =>
  `<g data-part="key" transform="${k.translateAlong(P, [dx, 0, 0])}">${[
    S(k.cylinder(HOOK[0], HOOK[1], 7, 0, 24, P, 28), { tone: "mid", crease: "none" }),
    S(k.cylinder(HOOK[0], HOOK[1], 4.5, 24, 3, P, 24), { tone: "hi" }),
    L(k.knurl(HOOK[0], HOOK[1], 7, 16, 22, 30, P), { tone: "lo" }),
    S(k.slabOf({ x: HOOK[0] - 2, y: HOOK[1] - 16, w: 4, d: 16, r: 1 }, 24, 3, P, 3), { tone: "lit" }),
    S(k.slabOf({ x: HOOK[0] - 2, y: HOOK[1] - 16, w: 10, d: 3, r: 1 }, 24, 3, P, 3), { tone: "lit" }),
    S(k.slabOf({ x: HOOK[0] + 4, y: HOOK[1] - 10, w: 3, d: 3, r: 0.6 }, 24, 3, P, 2), { tone: "lit" }),
    D([at([HOOK[0], HOOK[1], 27], P)], { size: 0.5, tone: "lit" }),
    L(k.ring(HOOK[0], HOOK[1], 9, 1, P, 24), { tone: "faint" }),
  ].join("")}</g>`;

const gate = (dz) =>
  `<g data-part="gate" transform="${k.translateAlong(P, [0, 0, dz])}">${[
    S(k.slabOf({ x: GATE_L + 4, y: GATE_Y - 3, w: GATE_R - GATE_L - 8, d: 6, r: 2 }, 40, 4, P, 3, 0.5), { tone: "lit" }),
    L(k.planOutline(k.insetPlan({ x: GATE_L + 4, y: GATE_Y - 3, w: GATE_R - GATE_L - 8, d: 6, r: 2 }, 1.6), 44, P, 3), { tone: "faint" }),
    D([GATE_L + 10, GATE_R - 10].map((x) => at([x, GATE_Y, 44], P)), { size: 0.45 }),
  ].join("")}</g>`;

const token = (dx) =>
  `<g data-part="token" transform="${k.translateAlong(P, [dx, 0, 0])}">${[
    S(k.slabOf({ x: 38, y: GATE_Y - 7, w: 18, d: 14, r: 2 }, 3, 6, P, 3, 0.4), { tone: "hi" }),
    L(k.planOutline(k.insetPlan({ x: 38, y: GATE_Y - 7, w: 18, d: 14, r: 2 }, 2), 9, P, 3), { tone: "faint" }),
    L(k.lineOnTop([41, GATE_Y - 3], [53, GATE_Y - 3], 9.2, P), { tone: "lo" }),
    L(k.lineOnTop([41, GATE_Y + 1], [49, GATE_Y + 1], 9.2, P), { tone: "lo" }),
    S(k.cylinder(47, GATE_Y, 2.2, 9, 4, P, 16), { tone: "mid" }),
    D([at([47, GATE_Y, 13], P)], { size: 0.5, tone: "lit" }),
  ].join("")}</g>`;

const scene = (state) => [
  bench(P),
  safe(),
  dial(),
  key(state > 0.5 ? 44 : 0),
  posts(P, [[GATE_L, GATE_Y], [GATE_R, GATE_Y]], 66),
  S(k.slabOf({ x: GATE_L, y: GATE_Y - 11, w: GATE_R - GATE_L, d: 22, r: 3 }, 2, 2, P, 3), { tone: "lo", crease: "none" }),
  gate(state > 0.5 ? -20 : 18),
  token(state > 0.5 ? 0 : 42),
  S(k.slabOf({ x: GATE_R - 12, y: GATE_Y - 9, w: 8, d: 18, r: 1.5 }, 10, 20, P, 3), { tone: "mid" }),
  [0, 1, 2].map((i) => L(k.lineOnTop([GATE_R - 10, GATE_Y - 5 + i * 5], [GATE_R - 6, GATE_Y - 5 + i * 5], 30.2, P), { tone: "lo" })).join(""),
  label(P, { x: 26, y: 12, w: 58, d: 26, r: 3 }, 0, [0.9, 0.7, 0.85]),
  knob(P, -118, 54, 0, 8, 9),
  L(k.lineOnTop([-118, 54], [-110, 54], 10.4, P), { tone: "lit", free: "start" }),
].join("");

const posterText = `<text class="iso-face-text" data-tone="hi" x="26" y="34" font-size="15">KEY IN CODE AND UNCHECKED NAME</text><text class="iso-face-text" data-tone="mid" x="26" y="${HEIGHT - 24}" font-size="12">Key removed · unsafe name rejected</text>`;

const live = `
const P = ${JSON.stringify(P)};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const key = svg.querySelector('[data-part="key"]');
const gate = svg.querySelector('[data-part="gate"]');
const token = svg.querySelector('[data-part="token"]');
const readout = document.querySelector("[data-readout]");
const words = ["Before: key in source · name unchecked", "After: key removed · unsafe name rejected"];
let value = 0, target = 0, frame = 0, last = 0, visible = false, idle = 0;
function draw() {
  key.setAttribute("transform", translateAlong(P, [value * 44, 0, 0]));
  gate.setAttribute("transform", translateAlong(P, [0, 0, 18 - value * 38]));
  token.setAttribute("transform", translateAlong(P, [(1 - value) * 42, 0, 0]));
  const text = words[value < 0.5 ? 0 : 1];
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(Math.round(value)));
  stage.setAttribute("aria-valuetext", text);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (Date.now() - idle > 4600) target = target < 0.5 ? 1 : 0;
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
  name: "hardcoded-key",
  fig: "Fig 3",
  title: "Key in code, unchecked name",
  hint: "Move the pointer or press an arrow key",
  caption: "A credential safe beside a name gate. Before, a key hangs on the hook and the name plate passes; after, the key is inside the safe and the gate drops to reject an unsafe name.",
  keys: [
    { mark: "lit", label: "Key, gate and name plate: what the fix changes" },
    { mark: "raised", label: "Safe lid, dial, ruler and stop block" },
  ],
  label: "A credential safe and a name gate. The key moves off the hook into the safe, and the gate drops to stop an unchecked file name.",
  readout: "Before: key in source · name unchecked",
  P,
  art: scene(0),
  posterArt: scene(1) + posterText,
  live,
});
