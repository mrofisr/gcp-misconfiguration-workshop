import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./kit/iso-kit.mjs";
import { kitScript } from "./scripts/inline-kit.mjs";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const OUT = join(HERE, "..");
export const WIDTH = 720;
export const HEIGHT = 430;
export const PLATE = { x: -140, y: -72, w: 280, d: 144, r: 9 };
export const PLATE_H = 12;
export const FOOT_H = 6;

export const project = (points, azimuth = 42) =>
  k.fitProjection([...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...points], WIDTH, HEIGHT, {
    pad: 34,
    azimuth,
  });

export const at = (point, P) => k.iso(point, P);
export const S = (paths, style = { tone: "mid" }) => k.solidSvg(paths, style);
export const L = (d, style = { tone: "lo" }) => k.lineSvg(d, style);
export const D = (points, style = { size: 0.45 }) => k.dotsSvg(points, style);
export const byDepth = (points, P) =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

export function bench(P) {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24), P)) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 2, P, 24), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.2, -PLATE_H - FOOT_H + 2, FOOT_H - 2, P, 24), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 14)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0], P)), { size: 0.5 }));
  const strip = { x: -100, y: PLATE.y + PLATE.d - 16, w: 200, d: 7, r: 1.5 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D(
    [at([strip.x + 2, strip.y + 3.5, 0.6], P), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6], P)],
    { size: 0.45 },
  ));
  return out.join("");
}

export function label(P, plan, z, lines, tone = "lo") {
  const out = [S(k.slabOf(plan, z, 1.6, P, 3), { tone: "mid", crease: "none" })];
  out.push(L(k.planOutline(k.insetPlan(plan, 2.2), z + 1.6, P, 3), { tone: "faint" }));
  lines.forEach((fraction, index) => {
    const y = plan.y + 3 + index * ((plan.d - 6) / Math.max(lines.length, 1));
    out.push(L(k.lineOnTop([plan.x + 3, y], [plan.x + 3 + (plan.w - 6) * fraction, y], z + 1.7, P), { tone }));
  });
  out.push(D([at([plan.x + 3, plan.y + plan.d - 3, z + 1.7], P)], { size: 0.4 }));
  return out.join("");
}

export function knob(P, x, y, z, radius, height) {
  return [
    S(k.cylinder(x, y, radius, z, height, P, 28), { tone: "mid" }),
    L(k.knurl(x, y, radius, z + 1, z + height - 0.6, 30, P), { tone: "lo" }),
    S(k.cylinder(x, y, radius * 0.45, z + height, 1.4, P, 20), { tone: "hi" }),
    D([at([x, y, z + height + 1.4], P)], { size: 0.5, tone: "hi" }),
  ].join("");
}

export function posts(P, xs, topZ, railY = 0) {
  const out = [];
  for (const [x, y] of xs) {
    out.push(S(k.slabOf({ x: x - 5, y: y - 5, w: 10, d: 10, r: 2 }, 0, 4, P, 3), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 3.2, 4, topZ - 4, P, 22), { tone: "mid", crease: "none" }));
    out.push(L(k.sideArc(x, y, 3.2, topZ * 0.6, P, 12), { tone: "faint" }));
    out.push(S(k.cylinder(x, y, 3.8, topZ, 2, P, 22), { tone: "mid" }));
  }
  out.push(S(
    k.slabOf({ x: xs[0][0], y: railY - 3, w: xs[1][0] - xs[0][0], d: 6, r: 2 }, topZ - 4, 4, P, 3, 0.4),
    { tone: "mid" },
  ));
  return out.join("");
}

export function gauge(P, x, y, z, radius, angle = 0) {
  const out = [];
  out.push(S(k.cylinder(x, y, radius, z, 7, P, 48), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, radius, z + 4.6, z + 7, 56, P), { tone: "lo" }));
  out.push(L(k.ring(x, y, radius - 2.6, z + 7, P, 48), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, radius - 3.2, 24, 3, z + 7, [1.2, 2.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  const needle = k.lineOnTop(
    [x - Math.sin(angle) * 2, y + Math.cos(angle) * 2],
    [x + Math.sin(angle) * (radius - 5), y - Math.cos(angle) * (radius - 5)],
    z + 7.2,
    P,
  );
  out.push(`<path class="iso-line" data-tone="lit" data-free="start" d="${needle}" style="stroke-width:1.1"/>`);
  out.push(S(k.cylinder(x, y, 1.7, z + 7, 1.2, P, 18), { tone: "mid" }));
  return out.join("");
}

export function writeFigure({ name, title, fig, hint, caption, keys, label, readout, P, art, moved, posterArt, live }) {
  const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body: art });
  const poster = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body: posterArt, standalone: "light" });
  const frameStyle = `<style>.iso-page{margin:4px auto 8px;width:min(700px,100% - 12px)!important}body{font-size:12px}body[data-embed] .iso-page{margin:0 auto;width:min(540px,100% - 8px)!important}body[data-embed] .iso-legend,body[data-embed] .iso-plate-corner[data-corner="hint"]{display:none}body[data-embed] .iso-figure{margin:0}.iso-poster{display:none;width:100%;height:auto}@media print{.iso-stage{display:none}.iso-poster{display:block}}@media(prefers-reduced-motion:reduce){.iso-stage{display:none}.iso-poster{display:block}}</style><script>if(new URLSearchParams(location.search).has("embed"))document.body.setAttribute("data-embed","");</script>`;
  const body = k.plateHtml({
    fig,
    title,
    hint,
    readout,
    keys,
    caption,
    body: `${frameStyle}<div class="iso-stage" tabindex="0" role="slider" aria-label="${title}: use arrow keys or pointer to change state" aria-valuemin="0" aria-valuemax="1">${svg}</div><img class="iso-poster" src="${name}.svg" alt="${label}">`,
  });
  writeFileSync(join(OUT, `${name}.html`), k.pageHtml({ title, theme: "light", width: 760, body, script: kitScript() + live }));
  writeFileSync(join(OUT, `${name}.svg`), poster);
  console.log(`wrote ${name}.html and ${name}.svg`);
}

export { k };
