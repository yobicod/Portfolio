import { memo } from "react";
import SplashCursor from "./SplashCursor";

/**
 * Container component for the splash cursor effect
 * Positioned as an overlay with pointer-events disabled
 */
const CursorBox = memo(function CursorBox() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none opacity-55 sm:opacity-70">
      <SplashCursor
        SPLAT_FORCE={4600}
        DENSITY_DISSIPATION={3.7}
        VELOCITY_DISSIPATION={2.25}
        SPLAT_RADIUS={0.17}
        BACK_COLOR={{ r: 0.02, g: 0.06, b: 0.12 }}
      />
    </div>
  );
});

export default CursorBox;
