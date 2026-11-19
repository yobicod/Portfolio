"use client";

import { useEffect, useRef } from "react";
import { Camera, Mesh, Program, Renderer, Sphere, Torus, Transform } from "ogl";

const vertex = `#version 300 es
in vec3 position;
in vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
out vec3 vNormal;
out vec3 vView;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const fragment = `#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vView;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uFlat;
uniform float uTime;
out vec4 fragColor;
void main() {
  vec3 n = normalize(vNormal);
  if (uFlat > 0.5) n = normalize(cross(dFdx(vView), dFdy(vView)));
  vec3 v = normalize(vView);
  vec3 l = normalize(vec3(0.35, 0.9, 0.65));
  float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.4);
  float diffuse = dot(n, l) * 0.5 + 0.5;
  vec3 color = mix(uColorB, uColorA, diffuse);
  vec3 iridescence = 0.5 + 0.5 * cos(6.2831 * (fresnel * 1.2 + vec3(0.0, 0.33, 0.67)) + uTime * 0.35);
  color = mix(color, iridescence, fresnel * 0.32);
  float specular = pow(max(dot(n, normalize(l + v)), 0.0), 64.0);
  color += specular * 0.55;
  color = mix(color, vec3(1.0), fresnel * 0.42);
  fragColor = vec4(color, 1.0);
}`;

type Shape = {
  kind: "torus" | "sphere" | "gem";
  /** Position as a fraction of the visible half-width / half-height. */
  x: number;
  y: number;
  z: number;
  size: number;
  colors: [string, string];
  spin: [number, number];
};

const shapes: Shape[] = [
  { kind: "torus", x: -0.96, y: 0.3, z: 0, size: 0.95, colors: ["#8ec5ff", "#0071e3"], spin: [0.28, 0.18] },
  { kind: "sphere", x: 0.97, y: 0.44, z: -1.5, size: 0.7, colors: ["#ffc9de", "#ff5fa2"], spin: [0.1, 0.12] },
  { kind: "gem", x: 0.9, y: -0.5, z: 0.6, size: 0.62, colors: ["#d9ccff", "#7d5cff"], spin: [0.2, 0.26] },
  { kind: "torus", x: -0.84, y: -0.6, z: -2, size: 0.62, colors: ["#ffe0b8", "#ff9f43"], spin: [-0.22, 0.3] },
  { kind: "sphere", x: -0.5, y: 0.84, z: -3, size: 0.3, colors: ["#c8f5ee", "#30c7b5"], spin: [0.1, 0.1] },
  { kind: "gem", x: 0.42, y: 0.86, z: -2.5, size: 0.34, colors: ["#cfe6ff", "#34a8ff"], spin: [0.3, -0.2] },
];

const hexToRgb = (hex: string) => [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
const easeOutBack = (t: number) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);

/** Floating glossy 3D shapes behind the hero. They follow the pointer and drift apart on scroll. */
export default function Hero3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    host.appendChild(gl.canvas);

    const cameraDistance = 10;
    const fov = 35;
    const camera = new Camera(gl, { fov, near: 0.1, far: 50 });
    camera.position.z = cameraDistance;
    const scene = new Transform();

    const geometries = {
      torus: new Torus(gl, { radius: 0.62, tube: 0.26, radialSegments: 96, tubularSegments: 48 }),
      sphere: new Sphere(gl, { radius: 0.75, widthSegments: 64 }),
      gem: new Sphere(gl, { radius: 0.8, widthSegments: 6, heightSegments: 4 }),
    };

    const meshes = shapes.map((shape, index) => {
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uColorA: { value: hexToRgb(shape.colors[0]) },
          uColorB: { value: hexToRgb(shape.colors[1]) },
          uFlat: { value: shape.kind === "gem" ? 1 : 0 },
          uTime: { value: 0 },
        },
      });
      const mesh = new Mesh(gl, { geometry: geometries[shape.kind], program });
      mesh.rotation.set(index * 1.3, index * 0.7, 0);
      mesh.setParent(scene);
      return mesh;
    });

    let halfWidth = 1;
    let halfHeight = 1;
    let compact = 1;
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
      halfHeight = Math.tan((fov * Math.PI) / 360) * cameraDistance;
      halfWidth = halfHeight * (width / height);
      compact = Math.min(1, Math.max(0.42, width / 1500));
    };

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / window.innerWidth - 0.5;
      pointer.targetY = event.clientY / window.innerHeight - 0.5;
    };

    const start = performance.now();
    let frame = 0;
    let visible = true;
    const render = (now: number) => {
      const time = (now - start) / 1000;
      const scroll = Math.min(1.5, window.scrollY / Math.max(1, host.clientHeight));
      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;

      meshes.forEach((mesh, index) => {
        const shape = shapes[index];
        const depth = 1 + (shape.z + 3) * 0.22;
        const intro = reducedMotion ? 1 : easeOutBack(Math.min(1, Math.max(0, time * 0.9 - index * 0.12)));
        const bob = reducedMotion ? 0 : Math.sin(time * 0.7 + index * 1.9) * 0.16;
        mesh.position.set(
          shape.x * halfWidth * (1 + scroll * 0.35) - pointer.x * depth * 0.7,
          shape.y * halfHeight + bob + scroll * depth * 2.4 + pointer.y * depth * 0.5,
          shape.z,
        );
        mesh.scale.set(shape.size * compact * intro);
        if (!reducedMotion) {
          mesh.rotation.x = index * 1.3 + time * shape.spin[0] + scroll * 1.6;
          mesh.rotation.y = index * 0.7 + time * shape.spin[1] + pointer.x * 0.8;
        }
        mesh.program.uniforms.uTime.value = time;
      });

      renderer.render({ scene, camera });
      frame = !reducedMotion && visible ? requestAnimationFrame(render) : 0;
    };

    const onResize = () => { resize(); if (!frame) frame = requestAnimationFrame(render); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(render);
    });

    resize();
    frame = requestAnimationFrame(render);
    observer.observe(host);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div className="hero-canvas" ref={hostRef} aria-hidden="true" />;
}
