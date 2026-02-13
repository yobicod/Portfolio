import { memo } from "react";
import SplashCursor from "./SplashCursor";

/**
 * Container component for the splash cursor effect
 * Positioned as an overlay with pointer-events disabled
 */
const CursorBox = memo(function CursorBox() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <SplashCursor />
    </div>
  );
});

export default CursorBox;
