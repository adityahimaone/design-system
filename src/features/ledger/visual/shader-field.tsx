"use client";

import { useEffect, useRef } from "react";
import {
  MESH_DRIFT_FRAGMENT_SHADER,
  MESH_DRIFT_VERTEX_SHADER,
} from "@/features/ledger/visual/mesh-drift";

/**
 * The field's five colours, low → high, retinted to the harbor ramp:
 * #060b16 (night ground) → #19398d (harbor indigo). Blended in OKLab
 * (u_transform.w = 1). Slots 5–7 repeat the last stop because WebGL1 wants a
 * fixed-size array; the shader never reads past u_scene.w = 5.
 */
const COLORS = [
  [0.024, 0.043, 0.086],
  [0.624, 0.706, 0.918],
  [0.29, 0.42, 0.753],
  [0.169, 0.31, 0.659],
  [0.098, 0.224, 0.553],
  [0.098, 0.224, 0.553],
  [0.098, 0.224, 0.553],
  [0.098, 0.224, 0.553],
] as const;

const COLOR_COUNT = 5;

/** Resolution is capped at 2× DPR, then rendered at 70% — it sits under a 24px blur. */
const DPR_CAP = 2;
const RENDER_SCALE = 0.7;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[shader-field]", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ShaderField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, MESH_DRIFT_VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, MESH_DRIFT_FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[shader-field]", gl.getProgramInfoLog(program));
      }
      return;
    }
    gl.useProgram(program);

    // Fullscreen triangle — three vertices, no index buffer.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const u = {
      colors: gl.getUniformLocation(program, "u_colors[0]"),
      scene: gl.getUniformLocation(program, "u_scene"),
      shape: gl.getUniformLocation(program, "u_shape"),
      surface: gl.getUniformLocation(program, "u_surface"),
      finish: gl.getUniformLocation(program, "u_finish"),
      transform: gl.getUniformLocation(program, "u_transform"),
      space: gl.getUniformLocation(program, "u_space"),
      cursor: gl.getUniformLocation(program, "u_cursor"),
    };

    const colorData = new Float32Array(COLORS.flat());

    // Pointer, in the shader's -1..1 canvas space (y up).
    const pointer = { x: 0, y: 0, target: 0, presence: 0 };

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr * RENDER_SCALE));
      const h = Math.max(
        1,
        Math.round(canvas.clientHeight * dpr * RENDER_SCALE)
      );
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const draw = (time: number) => {
      resize();
      gl.uniform3fv(u.colors, colorData);
      gl.uniform4f(u.scene, width, height, time * 1.09, COLOR_COUNT);
      gl.uniform4f(u.shape, 1.26, 0.35, 0.28, 0.0);
      gl.uniform4f(u.surface, 1.82, 1.37, -0.02, 0.68);
      gl.uniform4f(u.finish, 0.0, 0.54, 0.0, 0.22);
      gl.uniform4f(u.transform, 1.0, 0.0, 0.06, 1.0);
      gl.uniform4f(u.space, -0.05, 0.0, pointer.x, pointer.y);
      gl.uniform4f(u.cursor, pointer.presence, 4.0, 0.5, 0.8);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      // The still frame is the design: one draw, no loop.
      draw(0);
    }

    let raf = 0;
    let elapsed = 0;
    let last = performance.now();
    let running = false;

    const frame = (now: number) => {
      elapsed += (now - last) / 1000;
      last = now;
      pointer.presence += (pointer.target - pointer.presence) * 0.08;
      draw(elapsed);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
      pointer.target = 1;
    };
    const onPointerLeave = () => {
      pointer.target = 0;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const observer = new ResizeObserver(() => {
      if (!running && reducedMotion) draw(0);
    });
    observer.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    if (!document.hidden) start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
