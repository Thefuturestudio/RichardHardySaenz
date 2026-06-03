"use client";

import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision mediump float;
  uniform vec2 u_res;
  uniform float u_time;
  uniform float u_dark;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    uv.y = 1.0 - uv.y;

    float t = u_time * 0.26;

    vec2 p[6];
    p[0] = vec2(0.16 + 0.12 * sin(t * 0.70), 0.18 + 0.10 * cos(t * 0.52));
    p[1] = vec2(0.82 + 0.10 * cos(t * 0.48), 0.16 + 0.08 * sin(t * 0.82));
    p[2] = vec2(0.50 + 0.16 * sin(t * 0.40 + 1.0), 0.50 + 0.13 * cos(t * 0.56));
    p[3] = vec2(0.82 + 0.12 * sin(t * 0.62 + 2.0), 0.82 + 0.10 * cos(t * 0.44));
    p[4] = vec2(0.18 + 0.10 * cos(t * 0.76 + 1.6), 0.78 + 0.12 * sin(t * 0.60));
    p[5] = vec2(0.64 + 0.14 * cos(t * 0.34 + 2.4), 0.28 + 0.10 * sin(t * 0.72));

    vec3 c[6];
    c[0] = vec3(0.078, 0.843, 0.894);
    c[1] = vec3(0.078, 0.435, 1.000);
    c[2] = vec3(0.239, 0.275, 1.000);
    c[3] = vec3(0.882, 0.176, 0.925);
    c[4] = vec3(0.078, 0.843, 0.894);
    c[5] = vec3(0.239, 0.275, 1.000);

    vec3 col = vec3(0.0);
    float total = 0.0;
    for (int i = 0; i < 6; i++) {
      vec2 d = uv - p[i];
      float w = 1.0 / (dot(d, d) + 0.022);
      col += c[i] * w;
      total += w;
    }
    col /= total;

    vec3 bgLight = vec3(0.973, 0.980, 1.000);
    vec3 bgDark = vec3(0.020, 0.035, 0.071);
    vec3 bg = mix(bgLight, bgDark, u_dark);

    float strength = mix(0.58, 0.76, u_dark);
    col = mix(bg, col, strength);

    float vignette = smoothstep(0.94, 0.18, distance(uv, vec2(0.54, 0.48)));
    col += vignette * mix(0.035, 0.070, u_dark);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function makeShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type MeshGradientProps = {
  className?: string;
};

export function MeshGradient({ className = "" }: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: true });
    if (!gl) return;

    const context = gl;
    const vertexShader = makeShader(context, context.VERTEX_SHADER, VERT);
    const fragmentShader = makeShader(context, context.FRAGMENT_SHADER, FRAG);
    if (!vertexShader || !fragmentShader) return;

    const program = context.createProgram();
    if (!program) return;

    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);
    if (!context.getProgramParameter(program, context.LINK_STATUS)) return;
    context.useProgram(program);

    const buffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      context.STATIC_DRAW,
    );

    const position = context.getAttribLocation(program, "a_pos");
    context.enableVertexAttribArray(position);
    context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);

    const uRes = context.getUniformLocation(program, "u_res");
    const uTime = context.getUniformLocation(program, "u_time");
    const uDark = context.getUniformLocation(program, "u_dark");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let start = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      context.viewport(0, 0, canvas.width, canvas.height);
      context.uniform2f(uRes, canvas.width, canvas.height);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    function draw(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = reducedMotion ? 0 : (timestamp - start) / 1000;
      const dark = document.documentElement.dataset.theme === "dark" ? 1 : 0;
      context.uniform1f(uTime, elapsed);
      context.uniform1f(uDark, dark);
      context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      context.deleteProgram(program);
      if (buffer) context.deleteBuffer(buffer);
      context.deleteShader(vertexShader);
      context.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`viva-mesh-gradient pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
