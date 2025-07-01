"use client";
import React, { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

const Celebrate = () => {
  const [isClient, setIsClient] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [recycle, setRecycle] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    setIsClient(true);

    // Stop generating new confetti after 5s
    const stopRecycle = setTimeout(() => {
      setRecycle(false);
    }, 5000);

    // Fully stop the animation after 8s
    const stopRunning = setTimeout(() => {
      setIsRunning(false);
    }, 8000);

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
        recycle={recycle} // disables adding new confetti after 5s
        numberOfPieces={300} // default: you can reduce if needed
      />
    </div>
  );
};

export default Celebrate;
