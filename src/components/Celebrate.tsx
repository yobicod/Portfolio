"use client";
import { memo, useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

/** Duration in ms before stopping new confetti generation */
const STOP_RECYCLE_DELAY_MS = 5000;

/** Duration in ms before fully stopping the animation */
const STOP_RUNNING_DELAY_MS = 8000;

/** Number of confetti pieces to render */
const CONFETTI_PIECES = 300;

/**
 * Celebration component that displays confetti animation
 * Auto-stops generating new confetti after 5s and fully stops after 8s
 */
const Celebrate = memo(function Celebrate() {
  const [isClient, setIsClient] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [recycle, setRecycle] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    setIsClient(true);

    const stopRecycle = setTimeout(() => {
      setRecycle(false);
    }, STOP_RECYCLE_DELAY_MS);

    const stopRunning = setTimeout(() => {
      setIsRunning(false);
    }, STOP_RUNNING_DELAY_MS);

    return () => {
      clearTimeout(stopRecycle);
      clearTimeout(stopRunning);
    };
  }, []);

  if (!isClient || !isRunning) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-50">
      <Confetti
        width={width}
        height={height}
        wind={0}
        recycle={recycle}
        numberOfPieces={CONFETTI_PIECES}
      />
    </div>
  );
});

export default Celebrate;
