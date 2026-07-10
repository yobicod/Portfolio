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

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
}

void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uResolution.xy)/uResolution.y;
  float scene=uScroll*5.0;
  vec3 col=vec3(.018,.021,.026);

  vec2 focus=vec2(mix(.34,-.28,smoothstep(0.,1.,uScroll)), .12+sin(scene*.7)*.11);
  float glow=exp(-length(uv-focus)*3.2);
  col+=vec3(.025,.105,.28)*glow*(.2+.025*sin(uTime*.35));

  float horizon=-.3+sin(scene*.55)*.045;
  float gridX=abs(fract((uv.x/(uv.y-horizon+.001)+scene*.07)*7.)-.5);
  float gridY=abs(fract((1./(abs(uv.y-horizon)+.04)+scene*.35)*.28)-.5);
  float grid=(smoothstep(.026,.0,gridX)+smoothstep(.055,.0,gridY))*smoothstep(.08,.6,abs(uv.y-horizon));
  grid*=step(uv.y,horizon);
  col+=vec3(.02,.07,.16)*grid*.55;

  vec2 starCell=floor((uv+scene*vec2(.022,.008))*vec2(76.,48.));
  float stars=step(.9965,hash(starCell));
  stars*=.45+.55*sin(uTime*.8+hash(starCell)*6.28);
  col+=vec3(.18,.33,.58)*stars*smoothstep(.8,.1,length(uv));

  float beam=exp(-abs(uv.x+sin(scene*.3)*.5)*10.)*smoothstep(-.35,.75,uv.y);
  col+=vec3(.018,.05,.11)*beam*.16;
  col+=(hash(gl_FragCoord.xy+floor(uTime*12.))-.5)*.007;
  gl_FragColor=vec4(col,1.);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
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

export default function WebGLAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
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

    const readProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress = max > 0 ? window.scrollY / max : 0;
      if (reducedMotion.matches) draw(performance.now());
    };

    const resize = () => {
      const mobile = window.innerWidth < 760;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(performance.now());
    };

    const draw = (now: number) => {
      smoothProgress = reducedMotion.matches
        ? targetProgress
        : smoothProgress + (targetProgress - smoothProgress) * .045;
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, reducedMotion.matches ? 0 : now * .001);
      gl.uniform1f(scroll, smoothProgress);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const render = (now: number) => {
      if (!visible || reducedMotion.matches) return;
      draw(now);
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
