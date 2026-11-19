"use client";

import { type ReactNode, useEffect, useRef } from "react";

const BLOB_SIZE = 96;
const BLOB_BLUR = 36;
const MAX_SHIFT = 72;
const REACH = 90;

/**
 * A heading that behaves like liquid under the pointer: text near the cursor is dragged
 * along with its movement and then settles back. It is the real DOM text, pushed around by
 * an SVG displacement filter, so the gradient, both languages and screen readers still work.
 * The filter is attached only while the text is moving, so it is crisp at rest.
 */
export default function LiquidText({ as: Tag = "h1", id, children }: { as?: "h1" | "h2"; id: string; children: ReactNode }) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const blobRef = useRef<SVGFEFloodElement>(null);
  const filterId = `${id}-liquid`;

  useEffect(() => {
    const text = textRef.current;
    const blob = blobRef.current;
    if (!text || !blob || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pointer = { x: 0, y: 0, lastX: 0, lastY: 0, seen: false };
    const position = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let frame = 0;

    const tick = () => {
      position.x += (pointer.x - position.x) * 0.22;
      position.y += (pointer.y - position.y) * 0.22;
      velocity.x *= 0.88;
      velocity.y *= 0.88;
      const energy = Math.hypot(velocity.x, velocity.y);
      if (energy < 0.012) {
        text.style.filter = "";
        frame = 0;
        return;
      }
      // The map stores where each pixel samples from, so the text moves opposite to the stored offset.
      const red = Math.round(128 - velocity.x * 127);
      const green = Math.round(128 - velocity.y * 127);
      blob.setAttribute("x", `${position.x - BLOB_SIZE / 2}`);
      blob.setAttribute("y", `${position.y - BLOB_SIZE / 2}`);
      blob.setAttribute("flood-color", `rgb(${red},${green},128)`);
      text.style.filter = `url(#${filterId})`;
      frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = text.getBoundingClientRect();
      const inside = event.clientX > bounds.left - REACH && event.clientX < bounds.right + REACH
        && event.clientY > bounds.top - REACH && event.clientY < bounds.bottom + REACH;
      if (!inside) { pointer.seen = false; return; }
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      if (!pointer.seen) {
        pointer.seen = true;
        position.x = pointer.x;
        position.y = pointer.y;
      } else {
        const clamp = (value: number) => Math.max(-1, Math.min(1, value));
        velocity.x = clamp(velocity.x + (event.clientX - pointer.lastX) / 60);
        velocity.y = clamp(velocity.y + (event.clientY - pointer.lastY) / 60);
      }
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
      text.style.filter = "";
    };
  }, [filterId]);

  return (
    <>
      <svg className="liquid-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id={filterId} x="-10%" y="-25%" width="120%" height="150%" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodColor="rgb(128,128,128)" result="neutral" />
          <feFlood ref={blobRef} x="0" y="0" width={BLOB_SIZE} height={BLOB_SIZE} floodColor="rgb(128,128,128)" result="dot" />
          <feGaussianBlur in="dot" stdDeviation={BLOB_BLUR} result="spot" />
          <feMerge result="map"><feMergeNode in="neutral" /><feMergeNode in="spot" /></feMerge>
          <feDisplacementMap in="SourceGraphic" in2="map" scale={MAX_SHIFT} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <Tag id={id} ref={textRef}>{children}</Tag>
    </>
  );
}
