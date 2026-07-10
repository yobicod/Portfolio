"use client";

import { useEffect, useRef } from "react";

const vertex = `
attribute vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uScroll;

#define FAR 42.0
#define STEPS 54

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float sdBox(vec3 p, vec3 b){
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdSphere(vec3 p, float r){ return length(p) - r; }

vec2 joinScene(vec2 a, vec2 b){ return a.x < b.x ? a : b; }

vec2 mapScene(vec3 p){
  vec2 hit = vec2(p.y + 1.55, 1.0);

  // The atelier: a repeating architectural spine that makes the journey spatial.
  float bay = mod(p.z + 3.0, 7.0) - 3.5;
  hit = joinScene(hit, vec2(sdBox(vec3(abs(p.x) - 4.15, p.y - .65, bay), vec3(.12, 2.25, .13)), 2.0));
  hit = joinScene(hit, vec2(sdBox(vec3(p.x, p.y - 3.08, bay), vec3(4.25, .09, .13)), 2.0));
  hit = joinScene(hit, vec2(sdBox(vec3(abs(p.x) - 4.0, p.y + 1.12, p.z + 12.0), vec3(.24, .18, 22.0)), 2.0));

  // Floating workstations alternate along the corridor.
  float cell = floor((p.z + 3.0) / 7.0);
  float side = mix(-1.0, 1.0, step(.0, sin(cell * 4.17)));
  vec3 deskP = vec3(p.x - side * 2.45, p.y + .72, bay);
  hit = joinScene(hit, vec2(sdBox(deskP, vec3(1.48, .09, .82)), 3.0));
  hit = joinScene(hit, vec2(sdBox(vec3(deskP.x, deskP.y - .76, deskP.z + .2), vec3(.78, .68, .06)), 2.0));
  hit = joinScene(hit, vec2(sdBox(vec3(deskP.x, deskP.y - .76, deskP.z + .125), vec3(.68, .57, .018)), 4.0));

  // The AI core occupies the central knowledge chamber.
  vec3 core = p - vec3(0.0, .25, -9.2);
  hit = joinScene(hit, vec2(sdSphere(core, .38), 5.0));
  float ring = abs(length(core.xz) - 1.35) - .018;
  ring = max(ring, abs(core.y) - .018);
  hit = joinScene(hit, vec2(ring, 4.0));
  vec3 node = core;
  node.xz = mod(node.xz + .72, 1.44) - .72;
  float nodes = max(sdSphere(node, .045), sdSphere(core, 2.35));
  hit = joinScene(hit, vec2(nodes, 5.0));

  // Project monoliths become architectural exhibits, not detached cards.
  float exhibit = min(
    sdBox(p - vec3(-2.65, -.05, -17.0), vec3(1.05, 1.38, .08)),
    sdBox(p - vec3( 2.65, -.05, -24.0), vec3(1.05, 1.38, .08))
  );
  hit = joinScene(hit, vec2(exhibit, 4.0));
  return hit;
}

vec3 normalAt(vec3 p){
  vec2 e = vec2(.003, 0.0);
  float d = mapScene(p).x;
  return normalize(vec3(
    d - mapScene(p - e.xyy).x,
    d - mapScene(p - e.yxy).x,
    d - mapScene(p - e.yyx).x
  ));
}

float softShadow(vec3 ro, vec3 rd, float maxD){
  float shade = 1.0;
  float travel = .08;
  for(int i=0; i<12; i++){
    float h = mapScene(ro + rd * travel).x;
    shade = min(shade, 12.0 * h / travel);
    travel += clamp(h, .03, .45);
    if(h < .002 || travel > maxD) break;
  }
  return clamp(shade, .18, 1.0);
}

mat3 cameraBasis(vec3 ro, vec3 target){
  vec3 forward = normalize(target - ro);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  return mat3(right, cross(right, forward), forward);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - .5 * uResolution.xy) / uResolution.y;
  float t = uScroll * uScroll * (3.0 - 2.0 * uScroll);
  float chapter = t * 5.0;

  vec3 ro = vec3(
    sin(chapter * 1.82) * .44,
    .18 + sin(chapter * 1.13) * .11,
    mix(8.2, -31.5, t)
  );
  float lookX = sin((chapter + .35) * 1.82) * .62;
  vec3 target = ro + vec3(lookX, -.08 + sin(chapter * .7) * .05, -3.6);
  vec3 rd = cameraBasis(ro, target) * normalize(vec3(uv, 1.18));

  float travel = .0;
  float material = 0.0;
  for(int i=0; i<STEPS; i++){
    vec2 scene = mapScene(ro + rd * travel);
    if(scene.x < .0025 || travel > FAR){ material = scene.y; break; }
    travel += scene.x * .78;
  }

  vec3 color = vec3(.008, .011, .015);
  vec3 horizon = vec3(.015, .035, .06) * max(.0, rd.y + .35);
  color += horizon;

  if(travel < FAR){
    vec3 p = ro + rd * travel;
    vec3 n = normalAt(p);
    vec3 keyPos = ro + vec3(-2.5, 3.8, -3.0);
    vec3 lightDir = normalize(keyPos - p);
    float diffuse = max(dot(n, lightDir), 0.0);
    float shadow = softShadow(p + n * .015, lightDir, 8.0);
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);

    vec3 base = vec3(.055, .065, .078);
    if(material < 1.5) base = vec3(.025, .031, .04);
    else if(material < 2.5) base = vec3(.075, .085, .098);
    else if(material < 3.5) base = vec3(.11, .105, .095);
    else if(material < 4.5) base = vec3(.055, .23, .48);
    else base = vec3(.18, .46, .95);

    color = base * (.14 + diffuse * .72 * shadow);
    color += vec3(.12, .28, .55) * rim * .18;
    if(material > 3.5) color += base * (material > 4.5 ? 1.5 : .45);

    // Fine floor lines establish scale without particle noise.
    if(material < 1.5){
      float lineX = 1.0 - smoothstep(.0, .018, abs(fract(p.x * .5) - .5));
      float lineZ = 1.0 - smoothstep(.0, .018, abs(fract(p.z * .5) - .5));
      color += vec3(.06, .14, .27) * max(lineX, lineZ) * .22;
    }
    float fog = 1.0 - exp(-travel * .075);
    color = mix(color, vec3(.008, .016, .026), fog);
  }

  float practical = exp(-length(uv - vec2(.34 * sin(chapter), .16)) * 3.2);
  color += vec3(.02, .07, .17) * practical * .2;
  color *= 1.0 - dot(uv, uv) * .32;
  color += (hash21(gl_FragCoord.xy + floor(uTime * 3.0)) - .5) * .003;
  color = pow(color, vec3(.86));
  gl_FragColor = vec4(color, 1.0);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function WebGLAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      document.documentElement.classList.add("no-webgl");
      return;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) {
      document.documentElement.classList.add("no-webgl");
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      document.documentElement.classList.add("no-webgl");
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "uResolution");
    const time = gl.getUniformLocation(program, "uTime");
    const scroll = gl.getUniformLocation(program, "uScroll");
    let frame = 0;
    let visible = !document.hidden;
    let targetProgress = 0;
    let smoothProgress = 0;
    let lastFrame = 0;

    const readProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress = max > 0 ? window.scrollY / max : 0;
      if (reducedMotion.matches) draw(performance.now());
    };

    const resize = () => {
      const mobile = window.innerWidth < 760;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? .68 : 1.0);
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(performance.now());
    };

    const draw = (now: number) => {
      smoothProgress = reducedMotion.matches
        ? targetProgress
        : smoothProgress + (targetProgress - smoothProgress) * .055;
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, reducedMotion.matches ? 0 : now * .001);
      gl.uniform1f(scroll, smoothProgress);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const render = (now: number) => {
      if (!visible || reducedMotion.matches) return;
      const cameraMoving = Math.abs(targetProgress - smoothProgress) > .00008;
      // Render camera travel near 60 FPS, then idle at 12 FPS to avoid wasting GPU cycles.
      if (now - lastFrame > (cameraMoving ? 15 : 80)) {
        draw(now);
        lastFrame = now;
      }
      frame = requestAnimationFrame(render);
    };

    const handleVisibility = () => {
      visible = !document.hidden;
      cancelAnimationFrame(frame);
      if (visible && !reducedMotion.matches) frame = requestAnimationFrame(render);
    };

    const handleMotionChange = () => {
      cancelAnimationFrame(frame);
      draw(performance.now());
      if (!reducedMotion.matches && visible) frame = requestAnimationFrame(render);
    };

    readProgress();
    resize();
    if (!reducedMotion.matches) frame = requestAnimationFrame(render);
    window.addEventListener("scroll", readProgress, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", readProgress);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", handleMotionChange);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl-atmosphere" aria-hidden="true" />;
}
