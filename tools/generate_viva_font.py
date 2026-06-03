from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Callable
from zipfile import ZipFile, ZIP_DEFLATED

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont


UPM = 1000
ASCENT = 850
DESCENT = -250
STROKE = 78
OUT_DIR = Path("public/fonts/viva")


Point = tuple[float, float]
DrawFn = Callable[[TTGlyphPen], None]


def p(x: float, y: float) -> Point:
    return (round(x), round(y))


def add_contour(pen: TTGlyphPen, points: list[Point]) -> None:
    if len(points) < 3:
        return

    pen.moveTo(p(*points[0]))
    for point in points[1:]:
        pen.lineTo(p(*point))
    pen.closePath()


def ellipse_points(
    cx: float,
    cy: float,
    rx: float,
    ry: float,
    start_deg: float = 0,
    end_deg: float = 360,
    steps: int = 40,
) -> list[Point]:
    span = math.radians(end_deg - start_deg)
    start = math.radians(start_deg)
    return [
        (
            cx + math.cos(start + span * i / steps) * rx,
            cy + math.sin(start + span * i / steps) * ry,
        )
        for i in range(steps + 1)
    ]


def add_circle(pen: TTGlyphPen, cx: float, cy: float, r: float, steps: int = 28) -> None:
    add_contour(pen, ellipse_points(cx, cy, r, r, 0, -360, steps)[:-1])


def add_capsule(
    pen: TTGlyphPen,
    x1: float,
    y1: float,
    x2: float,
    y2: float,
    width: float = STROKE,
    steps: int = 10,
) -> None:
    dx = x2 - x1
    dy = y2 - y1
    length = math.hypot(dx, dy)
    if length == 0:
        add_circle(pen, x1, y1, width / 2)
        return

    phi = math.atan2(dy, dx)
    r = width / 2
    left = phi + math.pi / 2
    right = phi - math.pi / 2
    points: list[Point] = []
    points.append((x1 + math.cos(left) * r, y1 + math.sin(left) * r))
    points.append((x2 + math.cos(left) * r, y2 + math.sin(left) * r))

    for i in range(1, steps + 1):
        a = left + (right - left) * i / steps
        points.append((x2 + math.cos(a) * r, y2 + math.sin(a) * r))

    points.append((x1 + math.cos(right) * r, y1 + math.sin(right) * r))

    for i in range(1, steps + 1):
        a = right + (left - right) * i / steps
        points.append((x1 + math.cos(a) * r, y1 + math.sin(a) * r))

    add_contour(pen, points)


def stroke_line(
    pen: TTGlyphPen,
    a: Point,
    b: Point,
    width: float = STROKE,
) -> None:
    add_capsule(pen, a[0], a[1], b[0], b[1], width)


def stroke_polyline(
    pen: TTGlyphPen,
    points: list[Point],
    width: float = STROKE,
    closed: bool = False,
    joins: bool = True,
) -> None:
    if len(points) < 2:
        return

    pairs = list(zip(points, points[1:]))
    if closed:
        pairs.append((points[-1], points[0]))

    for a, b in pairs:
        stroke_line(pen, a, b, width)

    if joins:
        for point in points:
            add_circle(pen, point[0], point[1], width / 2)


def stroke_arc(
    pen: TTGlyphPen,
    cx: float,
    cy: float,
    rx: float,
    ry: float,
    start_deg: float,
    end_deg: float,
    width: float = STROKE,
    steps: int | None = None,
) -> None:
    span = abs(end_deg - start_deg)
    steps = steps or max(8, round(span / 10))
    stroke_polyline(
        pen,
        ellipse_points(cx, cy, rx, ry, start_deg, end_deg, steps),
        width,
    )


def cubic_points(p0: Point, p1: Point, p2: Point, p3: Point, steps: int = 22) -> list[Point]:
    points = []
    for i in range(steps + 1):
        t = i / steps
        mt = 1 - t
        x = (
            mt * mt * mt * p0[0]
            + 3 * mt * mt * t * p1[0]
            + 3 * mt * t * t * p2[0]
            + t * t * t * p3[0]
        )
        y = (
            mt * mt * mt * p0[1]
            + 3 * mt * mt * t * p1[1]
            + 3 * mt * t * t * p2[1]
            + t * t * t * p3[1]
        )
        points.append((x, y))
    return points


def stroke_cubic(
    pen: TTGlyphPen,
    p0: Point,
    p1: Point,
    p2: Point,
    p3: Point,
    width: float = STROKE,
    steps: int = 22,
) -> None:
    stroke_polyline(pen, cubic_points(p0, p1, p2, p3, steps), width)


def stroke_ellipse(
    pen: TTGlyphPen,
    cx: float,
    cy: float,
    rx: float,
    ry: float,
    width: float = STROKE,
    steps: int = 42,
) -> None:
    points = ellipse_points(cx, cy, rx, ry, 0, 360, steps)[:-1]
    stroke_polyline(pen, points, width, closed=True)


def draw_notdef(pen: TTGlyphPen) -> None:
    stroke_polyline(
        pen,
        [(95, 0), (95, 700), (505, 700), (505, 0)],
        STROKE * 0.8,
        closed=True,
    )
    stroke_line(pen, (130, 55), (470, 645), STROKE * 0.7)


def draw_period(pen: TTGlyphPen) -> None:
    add_circle(pen, 150, 40, 42)


def draw_comma(pen: TTGlyphPen) -> None:
    add_circle(pen, 150, 45, 42)
    stroke_line(pen, (160, 15), (110, -120), STROKE * 0.7)


def draw_colon(pen: TTGlyphPen) -> None:
    add_circle(pen, 155, 455, 39)
    add_circle(pen, 155, 65, 39)


def draw_semicolon(pen: TTGlyphPen) -> None:
    add_circle(pen, 155, 455, 39)
    draw_comma(pen)


def draw_quotes(pen: TTGlyphPen, double: bool = False) -> None:
    stroke_line(pen, (120, 700), (90, 540), STROKE * 0.55)
    if double:
        stroke_line(pen, (255, 700), (225, 540), STROKE * 0.55)


def draw_exclam(pen: TTGlyphPen) -> None:
    stroke_line(pen, (150, 690), (150, 170), STROKE * 0.78)
    add_circle(pen, 150, 40, 39)


def draw_question(pen: TTGlyphPen) -> None:
    stroke_arc(pen, 210, 520, 145, 165, 40, 250, STROKE * 0.9)
    stroke_line(pen, (300, 400), (200, 275), STROKE * 0.88)
    stroke_line(pen, (200, 275), (200, 185), STROKE * 0.88)
    add_circle(pen, 200, 40, 39)


def draw_dash(pen: TTGlyphPen, long: bool = False) -> None:
    stroke_line(pen, (80, 320), (520 if long else 350, 320), STROKE * 0.65)


def draw_underscore(pen: TTGlyphPen) -> None:
    stroke_line(pen, (70, -100), (430, -100), STROKE * 0.62)


def draw_slash(pen: TTGlyphPen, back: bool = False) -> None:
    if back:
        stroke_line(pen, (80, 720), (410, -120), STROKE * 0.58)
    else:
        stroke_line(pen, (410, 720), (80, -120), STROKE * 0.58)


def draw_pipe(pen: TTGlyphPen) -> None:
    stroke_line(pen, (150, 760), (150, -160), STROKE * 0.55)


def draw_paren(pen: TTGlyphPen, right: bool = False) -> None:
    if right:
        stroke_arc(pen, 70, 300, 210, 435, 72, -72, STROKE * 0.7)
    else:
        stroke_arc(pen, 330, 300, 210, 435, 108, 252, STROKE * 0.7)


def draw_bracket(pen: TTGlyphPen, right: bool = False) -> None:
    x = 95 if not right else 275
    direction = 1 if not right else -1
    stroke_line(pen, (x, -90), (x, 700), STROKE * 0.62)
    stroke_line(pen, (x, 700), (x + direction * 125, 700), STROKE * 0.62)
    stroke_line(pen, (x, -90), (x + direction * 125, -90), STROKE * 0.62)


def draw_brace(pen: TTGlyphPen, right: bool = False) -> None:
    sx = -1 if right else 1
    base = 260 if right else 120
    pts = [
        (base + sx * 130, 690),
        (base + sx * 30, 610),
        (base + sx * 65, 420),
        (base - sx * 20, 330),
        (base + sx * 65, 240),
        (base + sx * 30, 40),
        (base + sx * 130, -60),
    ]
    stroke_polyline(pen, pts, STROKE * 0.66)


def draw_plus(pen: TTGlyphPen) -> None:
    stroke_line(pen, (80, 315), (420, 315), STROKE * 0.66)
    stroke_line(pen, (250, 485), (250, 145), STROKE * 0.66)


def draw_equal(pen: TTGlyphPen) -> None:
    stroke_line(pen, (90, 410), (430, 410), STROKE * 0.62)
    stroke_line(pen, (90, 230), (430, 230), STROKE * 0.62)


def draw_angle(pen: TTGlyphPen, right: bool = False) -> None:
    if right:
        stroke_polyline(pen, [(110, 520), (405, 320), (110, 120)], STROKE * 0.62)
    else:
        stroke_polyline(pen, [(405, 520), (110, 320), (405, 120)], STROKE * 0.62)


def draw_tilde(pen: TTGlyphPen) -> None:
    stroke_polyline(
        pen,
        [(70, 270), (150, 330), (250, 270), (340, 330), (425, 270)],
        STROKE * 0.55,
    )


def draw_caret(pen: TTGlyphPen) -> None:
    stroke_polyline(pen, [(75, 470), (245, 690), (415, 470)], STROKE * 0.62)


def draw_star(pen: TTGlyphPen) -> None:
    cx, cy = 250, 360
    for deg in (90, 150, 210, 270, 330, 30):
        a = math.radians(deg)
        stroke_line(
            pen,
            (cx, cy),
            (cx + math.cos(a) * 185, cy + math.sin(a) * 185),
            STROKE * 0.55,
        )


def draw_hash(pen: TTGlyphPen) -> None:
    stroke_line(pen, (190, 675), (115, 20), STROKE * 0.58)
    stroke_line(pen, (365, 675), (290, 20), STROKE * 0.58)
    stroke_line(pen, (70, 455), (450, 455), STROKE * 0.58)
    stroke_line(pen, (50, 235), (430, 235), STROKE * 0.58)


def draw_percent(pen: TTGlyphPen) -> None:
    stroke_ellipse(pen, 155, 520, 72, 95, STROKE * 0.52, 22)
    stroke_ellipse(pen, 365, 125, 72, 95, STROKE * 0.52, 22)
    stroke_line(pen, (420, 700), (90, -20), STROKE * 0.55)


def draw_dollar(pen: TTGlyphPen) -> None:
    draw_S(pen)
    stroke_line(pen, (275, 760), (275, -70), STROKE * 0.54)


def draw_amp(pen: TTGlyphPen) -> None:
    stroke_ellipse(pen, 260, 505, 115, 150, STROKE * 0.75, 28)
    stroke_polyline(
        pen,
        [(285, 385), (120, 220), (175, 55), (365, 35), (495, 210)],
        STROKE * 0.84,
    )
    stroke_line(pen, (310, 320), (520, 30), STROKE * 0.78)


def draw_at(pen: TTGlyphPen) -> None:
    stroke_ellipse(pen, 300, 320, 235, 305, STROKE * 0.58, 44)
    stroke_ellipse(pen, 285, 300, 96, 126, STROKE * 0.62, 28)
    stroke_line(pen, (382, 410), (382, 245), STROKE * 0.62)
    stroke_arc(pen, 395, 300, 85, 115, 270, 30, STROKE * 0.58, 18)


def draw_A(pen: TTGlyphPen) -> None:
    stroke_polyline(pen, [(75, 0), (300, 700), (525, 0)], STROKE)


def draw_B(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 35), (105, 665))
    stroke_line(pen, (105, 665), (335, 665))
    stroke_arc(pen, 335, 515, 150, 150, 90, -90)
    stroke_line(pen, (335, 365), (105, 365))
    stroke_line(pen, (105, 365), (355, 365))
    stroke_arc(pen, 355, 200, 160, 165, 90, -90)
    stroke_line(pen, (355, 35), (105, 35))


def draw_C(pen: TTGlyphPen) -> None:
    stroke_arc(pen, 310, 350, 230, 320, 52, 308)


def draw_D(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 35), (105, 665))
    stroke_line(pen, (105, 665), (250, 665))
    stroke_arc(pen, 250, 350, 260, 315, 90, -90)
    stroke_line(pen, (250, 35), (105, 35))


def draw_E(pen: TTGlyphPen) -> None:
    stroke_line(pen, (110, 35), (110, 665))
    stroke_line(pen, (110, 665), (490, 665))
    stroke_line(pen, (110, 350), (430, 350))
    stroke_line(pen, (110, 35), (500, 35))


def draw_F(pen: TTGlyphPen) -> None:
    stroke_line(pen, (110, 35), (110, 665))
    stroke_line(pen, (110, 665), (490, 665))
    stroke_line(pen, (110, 350), (420, 350))


def draw_G(pen: TTGlyphPen) -> None:
    stroke_arc(pen, 315, 350, 235, 320, 52, 316)
    stroke_line(pen, (340, 310), (530, 310))
    stroke_line(pen, (530, 310), (530, 190))


def draw_H(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 35), (105, 665))
    stroke_line(pen, (495, 35), (495, 665))
    stroke_line(pen, (105, 350), (495, 350))


def draw_I(pen: TTGlyphPen) -> None:
    stroke_line(pen, (180, 35), (180, 665))


def draw_J(pen: TTGlyphPen) -> None:
    stroke_line(pen, (385, 665), (385, 190))
    stroke_arc(pen, 255, 190, 130, 140, 0, -190)


def draw_K(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 35), (105, 665))
    stroke_line(pen, (110, 350), (480, 665))
    stroke_line(pen, (110, 350), (500, 35))


def draw_L(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 665), (105, 35))
    stroke_line(pen, (105, 35), (470, 35))


def draw_M(pen: TTGlyphPen) -> None:
    stroke_polyline(pen, [(90, 0), (90, 665), (310, 115), (530, 665), (530, 0)], STROKE)


def draw_N(pen: TTGlyphPen) -> None:
    stroke_polyline(pen, [(105, 0), (105, 665), (505, 35), (505, 700)], STROKE)


def draw_O(pen: TTGlyphPen) -> None:
    stroke_ellipse(pen, 300, 350, 225, 320)


def draw_P(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 35), (105, 665))
    stroke_line(pen, (105, 665), (340, 665))
    stroke_arc(pen, 340, 510, 160, 155, 90, -90)
    stroke_line(pen, (340, 355), (105, 355))


def draw_Q(pen: TTGlyphPen) -> None:
    draw_O(pen)
    stroke_line(pen, (405, 110), (540, -65), STROKE * 0.86)


def draw_R(pen: TTGlyphPen) -> None:
    draw_P(pen)
    stroke_line(pen, (280, 340), (505, 35))


def draw_S(pen: TTGlyphPen) -> None:
    stroke_cubic(pen, (480, 610), (390, 735), (125, 720), (100, 535), STROKE)
    stroke_cubic(pen, (100, 535), (80, 410), (350, 410), (455, 305), STROKE)
    stroke_cubic(pen, (455, 305), (585, 170), (330, -20), (110, 95), STROKE)


def draw_T(pen: TTGlyphPen) -> None:
    stroke_line(pen, (70, 665), (530, 665))
    stroke_line(pen, (300, 665), (300, 35))


def draw_U(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 665), (105, 185))
    stroke_arc(pen, 300, 185, 195, 160, 180, 360)
    stroke_line(pen, (495, 185), (495, 665))


def draw_V(pen: TTGlyphPen) -> None:
    stroke_polyline(pen, [(70, 665), (300, 35), (530, 665)], STROKE)


def draw_W(pen: TTGlyphPen) -> None:
    stroke_polyline(pen, [(70, 665), (195, 35), (330, 420), (465, 35), (590, 665)], STROKE)


def draw_X(pen: TTGlyphPen) -> None:
    stroke_line(pen, (80, 665), (520, 35))
    stroke_line(pen, (520, 665), (80, 35))


def draw_Y(pen: TTGlyphPen) -> None:
    stroke_polyline(pen, [(80, 665), (300, 360), (520, 665)], STROKE)
    stroke_line(pen, (300, 360), (300, 35))


def draw_Z(pen: TTGlyphPen) -> None:
    stroke_line(pen, (80, 665), (520, 665))
    stroke_line(pen, (520, 665), (80, 35))
    stroke_line(pen, (80, 35), (520, 35))


def draw_a(pen: TTGlyphPen) -> None:
    stroke_ellipse(pen, 245, 255, 155, 210)
    stroke_line(pen, (400, 420), (400, 55))


def draw_b(pen: TTGlyphPen) -> None:
    stroke_line(pen, (110, 700), (110, 45))
    stroke_ellipse(pen, 285, 255, 165, 210)


def draw_c(pen: TTGlyphPen) -> None:
    stroke_arc(pen, 285, 255, 175, 215, 52, 308)


def draw_d(pen: TTGlyphPen) -> None:
    stroke_line(pen, (430, 700), (430, 45))
    stroke_ellipse(pen, 255, 255, 165, 210)


def draw_e(pen: TTGlyphPen) -> None:
    stroke_arc(pen, 280, 255, 180, 215, 35, 335)
    stroke_line(pen, (140, 270), (430, 270), STROKE * 0.86)


def draw_f(pen: TTGlyphPen) -> None:
    stroke_line(pen, (260, 35), (260, 610))
    stroke_arc(pen, 365, 610, 105, 115, 180, 65)
    stroke_line(pen, (145, 420), (405, 420), STROKE * 0.86)


def draw_g(pen: TTGlyphPen) -> None:
    stroke_ellipse(pen, 255, 255, 160, 205)
    stroke_line(pen, (415, 420), (415, -95))
    stroke_arc(pen, 285, -95, 130, 105, 0, -185)


def draw_h(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 35), (105, 700))
    stroke_arc(pen, 285, 250, 180, 205, 180, 0)
    stroke_line(pen, (465, 250), (465, 35))


def draw_i(pen: TTGlyphPen) -> None:
    add_circle(pen, 155, 650, 42)
    stroke_line(pen, (155, 455), (155, 35))


def draw_j(pen: TTGlyphPen) -> None:
    add_circle(pen, 180, 650, 42)
    stroke_line(pen, (180, 455), (180, -80))
    stroke_arc(pen, 95, -80, 85, 95, 0, -180)


def draw_k(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 35), (105, 700))
    stroke_line(pen, (110, 260), (405, 460))
    stroke_line(pen, (110, 260), (430, 35))


def draw_l(pen: TTGlyphPen) -> None:
    stroke_line(pen, (150, 35), (150, 700))


def draw_m(pen: TTGlyphPen) -> None:
    stroke_line(pen, (95, 35), (95, 455))
    stroke_arc(pen, 225, 255, 130, 200, 180, 0)
    stroke_line(pen, (355, 255), (355, 35))
    stroke_arc(pen, 485, 255, 130, 200, 180, 0)
    stroke_line(pen, (615, 255), (615, 35))


def draw_n(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 35), (105, 455))
    stroke_arc(pen, 285, 255, 180, 200, 180, 0)
    stroke_line(pen, (465, 255), (465, 35))


def draw_o(pen: TTGlyphPen) -> None:
    stroke_ellipse(pen, 270, 255, 175, 215)


def draw_p(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, -175), (105, 455))
    stroke_ellipse(pen, 285, 255, 165, 205)


def draw_q(pen: TTGlyphPen) -> None:
    stroke_line(pen, (425, 455), (425, -175))
    stroke_ellipse(pen, 250, 255, 165, 205)


def draw_r(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 35), (105, 455))
    stroke_arc(pen, 270, 255, 165, 200, 180, 65)


def draw_s(pen: TTGlyphPen) -> None:
    stroke_cubic(pen, (420, 420), (335, 515), (120, 490), (105, 345), STROKE * 0.9)
    stroke_cubic(pen, (105, 345), (95, 250), (340, 250), (415, 150), STROKE * 0.9)
    stroke_cubic(pen, (415, 150), (500, 25), (220, -15), (95, 105), STROKE * 0.9)


def draw_t(pen: TTGlyphPen) -> None:
    stroke_line(pen, (240, 620), (240, 70))
    stroke_line(pen, (100, 420), (380, 420), STROKE * 0.86)
    stroke_arc(pen, 330, 70, 90, 80, 180, 285, STROKE * 0.86)


def draw_u(pen: TTGlyphPen) -> None:
    stroke_line(pen, (105, 455), (105, 165))
    stroke_arc(pen, 285, 165, 180, 135, 180, 360)
    stroke_line(pen, (465, 165), (465, 455))


def draw_v(pen: TTGlyphPen) -> None:
    stroke_polyline(pen, [(70, 455), (270, 35), (470, 455)], STROKE)


def draw_w(pen: TTGlyphPen) -> None:
    stroke_polyline(pen, [(60, 455), (185, 35), (315, 320), (445, 35), (570, 455)], STROKE)


def draw_x(pen: TTGlyphPen) -> None:
    stroke_line(pen, (85, 455), (455, 35))
    stroke_line(pen, (455, 455), (85, 35))


def draw_y(pen: TTGlyphPen) -> None:
    stroke_line(pen, (80, 455), (280, 70))
    stroke_line(pen, (480, 455), (240, -175))


def draw_z(pen: TTGlyphPen) -> None:
    stroke_line(pen, (80, 455), (450, 455))
    stroke_line(pen, (450, 455), (80, 35))
    stroke_line(pen, (80, 35), (450, 35))


def draw_0(pen: TTGlyphPen) -> None:
    stroke_ellipse(pen, 285, 350, 205, 320)


def draw_1(pen: TTGlyphPen) -> None:
    stroke_line(pen, (270, 35), (270, 665))
    stroke_line(pen, (170, 560), (270, 665), STROKE * 0.82)


def draw_2(pen: TTGlyphPen) -> None:
    stroke_cubic(pen, (115, 520), (180, 710), (515, 705), (490, 500))
    stroke_cubic(pen, (490, 500), (475, 380), (285, 260), (120, 35))
    stroke_line(pen, (115, 35), (505, 35))


def draw_3(pen: TTGlyphPen) -> None:
    stroke_cubic(pen, (125, 615), (265, 735), (520, 635), (385, 365))
    stroke_cubic(pen, (385, 365), (570, 320), (500, 15), (150, 75))


def draw_4(pen: TTGlyphPen) -> None:
    stroke_line(pen, (410, 665), (410, 35))
    stroke_line(pen, (410, 665), (95, 245))
    stroke_line(pen, (95, 245), (500, 245))


def draw_5(pen: TTGlyphPen) -> None:
    stroke_line(pen, (460, 665), (130, 665))
    stroke_line(pen, (130, 665), (115, 365))
    stroke_cubic(pen, (115, 365), (445, 445), (570, 145), (350, 45))
    stroke_cubic(pen, (350, 45), (265, 10), (165, 25), (100, 105))


def draw_6(pen: TTGlyphPen) -> None:
    stroke_arc(pen, 330, 520, 205, 180, 135, 300)
    stroke_ellipse(pen, 280, 230, 190, 205)


def draw_7(pen: TTGlyphPen) -> None:
    stroke_line(pen, (95, 665), (500, 665))
    stroke_line(pen, (500, 665), (210, 35))


def draw_8(pen: TTGlyphPen) -> None:
    stroke_ellipse(pen, 285, 510, 170, 160)
    stroke_ellipse(pen, 285, 170, 190, 170)


def draw_9(pen: TTGlyphPen) -> None:
    stroke_ellipse(pen, 300, 470, 190, 205)
    stroke_cubic(pen, (450, 340), (410, 150), (280, 35), (125, 70))


WIDTHS: dict[str, int] = {
    " ": 300,
    "I": 360,
    "J": 520,
    "M": 640,
    "W": 680,
    "i": 300,
    "j": 330,
    "l": 300,
    "m": 720,
    "w": 640,
    ".": 260,
    ",": 280,
    ":": 280,
    ";": 280,
    "'": 220,
    '"': 340,
    "!": 280,
    "?": 460,
    "-": 440,
    "_": 500,
    "/": 500,
    "\\": 500,
    "|": 280,
    "(": 390,
    ")": 390,
    "[": 360,
    "]": 360,
    "{": 420,
    "}": 420,
    "@": 640,
    "#": 520,
    "$": 600,
    "%": 540,
    "&": 590,
    "*": 500,
    "+": 500,
    "=": 520,
    "<": 520,
    ">": 520,
    "~": 500,
    "^": 500,
    "0": 570,
    "1": 460,
    "2": 570,
    "3": 550,
    "4": 570,
    "5": 570,
    "6": 570,
    "7": 560,
    "8": 570,
    "9": 570,
}


DRAWERS: dict[str, DrawFn] = {
    "A": draw_A,
    "B": draw_B,
    "C": draw_C,
    "D": draw_D,
    "E": draw_E,
    "F": draw_F,
    "G": draw_G,
    "H": draw_H,
    "I": draw_I,
    "J": draw_J,
    "K": draw_K,
    "L": draw_L,
    "M": draw_M,
    "N": draw_N,
    "O": draw_O,
    "P": draw_P,
    "Q": draw_Q,
    "R": draw_R,
    "S": draw_S,
    "T": draw_T,
    "U": draw_U,
    "V": draw_V,
    "W": draw_W,
    "X": draw_X,
    "Y": draw_Y,
    "Z": draw_Z,
    "a": draw_a,
    "b": draw_b,
    "c": draw_c,
    "d": draw_d,
    "e": draw_e,
    "f": draw_f,
    "g": draw_g,
    "h": draw_h,
    "i": draw_i,
    "j": draw_j,
    "k": draw_k,
    "l": draw_l,
    "m": draw_m,
    "n": draw_n,
    "o": draw_o,
    "p": draw_p,
    "q": draw_q,
    "r": draw_r,
    "s": draw_s,
    "t": draw_t,
    "u": draw_u,
    "v": draw_v,
    "w": draw_w,
    "x": draw_x,
    "y": draw_y,
    "z": draw_z,
    "0": draw_0,
    "1": draw_1,
    "2": draw_2,
    "3": draw_3,
    "4": draw_4,
    "5": draw_5,
    "6": draw_6,
    "7": draw_7,
    "8": draw_8,
    "9": draw_9,
    ".": draw_period,
    ",": draw_comma,
    ":": draw_colon,
    ";": draw_semicolon,
    "'": lambda pen: draw_quotes(pen, False),
    '"': lambda pen: draw_quotes(pen, True),
    "!": draw_exclam,
    "?": draw_question,
    "-": draw_dash,
    "_": draw_underscore,
    "/": lambda pen: draw_slash(pen, False),
    "\\": lambda pen: draw_slash(pen, True),
    "|": draw_pipe,
    "(": lambda pen: draw_paren(pen, False),
    ")": lambda pen: draw_paren(pen, True),
    "[": lambda pen: draw_bracket(pen, False),
    "]": lambda pen: draw_bracket(pen, True),
    "{": lambda pen: draw_brace(pen, False),
    "}": lambda pen: draw_brace(pen, True),
    "@": draw_at,
    "#": draw_hash,
    "$": draw_dollar,
    "%": draw_percent,
    "&": draw_amp,
    "*": draw_star,
    "+": draw_plus,
    "=": draw_equal,
    "<": lambda pen: draw_angle(pen, False),
    ">": lambda pen: draw_angle(pen, True),
    "~": draw_tilde,
    "^": draw_caret,
}


def glyph_name(char: str) -> str:
    return f"uni{ord(char):04X}"


def build_glyph(draw: DrawFn | None) -> object:
    pen = TTGlyphPen(None)
    if draw:
        draw(pen)
    return pen.glyph()


def write_support_files() -> None:
    css = """@font-face {
  font-family: "Viva Head";
  src:
    url("./VivaHead-Regular.woff2") format("woff2"),
    url("./VivaHead-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-viva-head: "Viva Head", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.viva-heading {
  font-family: var(--font-viva-head);
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
"""
    (OUT_DIR / "viva-head.css").write_text(css, encoding="utf-8")

    specimen = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Viva Head Font Specimen</title>
    <link rel="stylesheet" href="./viva-head.css" />
    <style>
      :root {
        color-scheme: light;
        --ink: #090b10;
        --muted: #5d6678;
        --line: #d7dce6;
        --brand: #0a80ff;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: #f7f9fc;
        color: var(--ink);
        font: 16px/1.5 Inter, ui-sans-serif, system-ui, sans-serif;
      }

      main {
        width: min(1120px, calc(100vw - 48px));
        margin: 0 auto;
        padding: 64px 0 80px;
      }

      .brand {
        align-items: center;
        display: flex;
        gap: 16px;
        margin-bottom: 52px;
      }

      .dot {
        background: linear-gradient(135deg, #13d9c8, #0d5bff);
        border-radius: 999px;
        display: block;
        height: 34px;
        width: 34px;
      }

      h1,
      .sample,
      .glyphs {
        font-family: "Viva Head", system-ui, sans-serif;
        font-weight: 400;
      }

      h1 {
        font-size: clamp(40px, 7vw, 96px);
        letter-spacing: 0.08em;
        line-height: 1;
        margin: 0;
        text-transform: uppercase;
      }

      .sample {
        border-bottom: 1px solid var(--line);
        border-top: 1px solid var(--line);
        font-size: clamp(34px, 6vw, 76px);
        letter-spacing: 0.11em;
        line-height: 1.1;
        margin: 0 0 48px;
        padding: 36px 0;
        text-transform: uppercase;
      }

      section {
        margin-top: 36px;
      }

      h2 {
        color: var(--brand);
        font-size: 13px;
        letter-spacing: 0.18em;
        margin: 0 0 16px;
        text-transform: uppercase;
      }

      .glyphs {
        color: #05070b;
        display: grid;
        font-size: clamp(30px, 5vw, 58px);
        gap: 20px 28px;
        grid-template-columns: repeat(auto-fit, minmax(42px, 1fr));
        letter-spacing: 0.04em;
        line-height: 1;
      }

      p {
        color: var(--muted);
        max-width: 760px;
      }
    </style>
  </head>
  <body>
    <main>
      <div class="brand">
        <span class="dot"></span>
        <h1>Viva Head</h1>
      </div>
      <p class="sample">Attention That Converts</p>
      <section>
        <h2>Uppercase</h2>
        <div class="glyphs">A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</div>
      </section>
      <section>
        <h2>Lowercase</h2>
        <div class="glyphs">a b c d e f g h i j k l m n o p q r s t u v w x y z</div>
      </section>
      <section>
        <h2>Numerals</h2>
        <div class="glyphs">0 1 2 3 4 5 6 7 8 9</div>
      </section>
      <section>
        <h2>Punctuation</h2>
        <div class="glyphs">! ? . , : ; ' " / \\ - _ ( ) [ ] { } @ # $ % & * + = &lt; &gt; | ~ ^</div>
      </section>
      <p>
        Use this as a display face for Viva headings, labels, and branded moments. For long paragraphs,
        pair it with the app's normal UI sans-serif.
      </p>
    </main>
  </body>
</html>
"""
    (OUT_DIR / "specimen.html").write_text(specimen, encoding="utf-8")

    readme = """# Viva Head

`Viva Head` is a bespoke rounded monoline display font generated from the supplied Viva alphabet sheet.

## Files

- `VivaHead-Regular.woff2` - preferred web font.
- `VivaHead-Regular.ttf` - desktop/installable fallback.
- `viva-head.css` - drop-in `@font-face` and `.viva-heading` helper.
- `specimen.html` - local visual proof sheet.

## Next.js usage

Copy the font files into `public/fonts/viva/`, then import or paste the `@font-face` block from `viva-head.css`.

```css
@font-face {
  font-family: "Viva Head";
  src: url("/fonts/viva/VivaHead-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

.viva-heading {
  font-family: "Viva Head", system-ui, sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

This version covers uppercase, lowercase, numerals, and common ASCII punctuation. It is tuned as a display/heading face rather than a paragraph font.
"""
    (OUT_DIR / "README.md").write_text(readme, encoding="utf-8")

    manifest = {
        "family": "Viva Head",
        "style": "Regular",
        "version": "1.0.0",
        "formats": ["woff2", "ttf"],
        "coverage": "ASCII letters, numerals, punctuation, and symbols",
        "recommendedUsage": "Display headings, labels, navigation highlights, and branded UI moments",
    }
    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )


def write_preview() -> None:
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("Skipping preview image because Pillow is not installed.")
        return

    font_path = OUT_DIR / "VivaHead-Regular.ttf"
    img = Image.new("RGB", (1800, 1200), "#f8fafc")
    draw = ImageDraw.Draw(img)

    blue = "#0a80ff"
    ink = "#05070b"
    muted = "#64748b"
    font_big = ImageFont.truetype(str(font_path), 128)
    font_mid = ImageFont.truetype(str(font_path), 76)
    font_small = ImageFont.truetype(str(font_path), 56)
    ui = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 28)
    ui_bold = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 30)

    draw.ellipse((95, 92, 145, 142), fill=blue)
    draw.text((175, 72), "Viva Head", font=font_big, fill=blue)
    draw.line((95, 225, 1705, 225), fill="#cbd5e1", width=3)
    draw.text((95, 285), "SAMPLE LINE", font=ui_bold, fill=blue)
    draw.text((95, 340), "ATTENTION THAT CONVERTS", font=font_mid, fill=ink)
    draw.line((95, 460, 1705, 460), fill="#cbd5e1", width=2)
    draw.text((95, 525), "UPPERCASE", font=ui_bold, fill=blue)
    draw.text((95, 580), "A B C D E F G H I J K L M", font=font_small, fill=ink)
    draw.text((95, 665), "N O P Q R S T U V W X Y Z", font=font_small, fill=ink)
    draw.text((95, 780), "LOWERCASE + NUMERALS", font=ui_bold, fill=blue)
    draw.text((95, 835), "a b c d e f g h i j k l m  0 1 2 3 4", font=font_small, fill=ink)
    draw.text((95, 920), "n o p q r s t u v w x y z  5 6 7 8 9", font=font_small, fill=ink)
    draw.text((95, 1045), "Generated webfont: VivaHead-Regular.woff2", font=ui, fill=muted)
    img.save(OUT_DIR / "viva-head-preview.png")


def write_package() -> None:
    package_path = OUT_DIR / "VivaHead-font-package.zip"
    files = [
        "VivaHead-Regular.woff2",
        "VivaHead-Regular.ttf",
        "viva-head.css",
        "README.md",
        "manifest.json",
        "specimen.html",
        "viva-head-preview.png",
    ]

    with ZipFile(package_path, "w", ZIP_DEFLATED) as archive:
        for filename in files:
            path = OUT_DIR / filename
            if path.exists():
                archive.write(path, arcname=filename)


def build_font() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    chars = [chr(i) for i in range(32, 127)]
    glyph_order = [".notdef"] + [glyph_name(char) for char in chars]
    cmap = {ord(char): glyph_name(char) for char in chars}

    glyphs = {".notdef": build_glyph(draw_notdef)}
    hmetrics = {".notdef": (620, 40)}

    for char in chars:
        name = glyph_name(char)
        draw = DRAWERS.get(char)
        glyphs[name] = build_glyph(draw)
        hmetrics[name] = (WIDTHS.get(char, 600), 40)

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(hmetrics)
    fb.setupHorizontalHeader(ascent=ASCENT, descent=DESCENT)
    fb.setupOS2(
        sTypoAscender=ASCENT,
        sTypoDescender=DESCENT,
        sTypoLineGap=0,
        usWinAscent=920,
        usWinDescent=300,
        usWeightClass=400,
        usWidthClass=5,
        fsType=0,
        achVendID="VIVA",
    )
    fb.setupNameTable(
        {
            "familyName": "Viva Head",
            "styleName": "Regular",
            "uniqueFontIdentifier": "Viva Head Regular 1.0",
            "fullName": "Viva Head Regular",
            "psName": "VivaHead-Regular",
            "version": "Version 1.0",
            "manufacturer": "Viva",
            "designer": "Viva / OpenAI Codex",
            "description": "Rounded monoline display typeface generated from the Viva alphabet exploration sheet.",
            "copyright": "Copyright 2026 Viva. Generated for Viva app branding.",
        }
    )
    fb.setupPost(isFixedPitch=False)

    ttf_path = OUT_DIR / "VivaHead-Regular.ttf"
    woff2_path = OUT_DIR / "VivaHead-Regular.woff2"
    fb.save(ttf_path)

    font = TTFont(ttf_path)
    font.flavor = "woff2"
    font.save(woff2_path)

    write_support_files()
    write_preview()
    write_package()

    check = TTFont(ttf_path)
    present = len(check["cmap"].getBestCmap())
    print(f"Wrote {ttf_path} and {woff2_path}")
    print(f"Mapped characters: {present}")


if __name__ == "__main__":
    build_font()
