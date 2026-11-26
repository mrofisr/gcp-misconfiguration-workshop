#!/usr/bin/env python3
"""Check that the reveal.js deck matches the authoritative workshop agenda.

Usage: python3 slides/check-outline.py [path/to/index.html]
Exit status 0 means the deck matches; 1 means it drifted from the outline.
"""

import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUTLINE = HERE.parent / "workshop" / "slides" / "outline.md"
DECK = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "index.html"


def expected_segments():
    segments = []
    for line in OUTLINE.read_text(encoding="utf-8").splitlines():
        if not line.startswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) < 3 or not cells[0].isdigit():
            continue
        match = re.search(r"\((\d+)\s*min\)", cells[1])
        if match:
            segments.append((cells[2], int(match.group(1))))
    return segments


def deck_segments(html):
    return [
        (title, int(minutes))
        for minutes, title in re.findall(
            r'data-segment="[^"]+"\s+data-duration="(\d+)"\s+data-title="([^"]+)"',
            html,
        )
    ]


def agenda_rows(html):
    return [
        (title, int(minutes))
        for minutes, title in re.findall(
            r"<tr><td>\d+</td><td>(\d+) min</td><td>([^<]+)</td>", html
        )
    ]


def main():
    expected = expected_segments()
    html = DECK.read_text(encoding="utf-8")
    segments = deck_segments(html)
    agenda = agenda_rows(html)
    problems = []

    if len(expected) != 7:
        problems.append(f"outline has {len(expected)} segments, expected 7")
    if segments != expected:
        problems.append(f"segment banners differ from outline: {segments!r} != {expected!r}")
    if agenda != expected:
        problems.append(f"agenda table differs from outline: {agenda!r} != {expected!r}")
    if sum(minutes for _, minutes in segments) != 90:
        problems.append("deck durations do not total 90 minutes")

    if problems:
        print("FAIL: deck does not match workshop/slides/outline.md")
        for problem in problems:
            print(f"  - {problem}")
        return 1

    titles = ", ".join(title for title, _ in expected)
    print(f"PASS: {len(expected)} segments in order, {sum(m for _, m in expected)} minutes")
    print(f"  {titles}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
