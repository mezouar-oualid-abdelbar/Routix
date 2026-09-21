import { useCallback, useEffect, useRef, useState } from "react";

// Shared countdown logic for task timers (Timed screen + Multi task rows).
// Callbacks (ref-held, never stale):
//   onPersist(secondsLeft) - save progress periodically / on pause / unmount
//   onFinish()              - countdown reached zero
export function useTaskTimer({ persistInterval = 5 } = {}) {
  const [timeLeft, setTimeLeftState] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const timeLeftRef = useRef(0);
  const isRunningRef = useRef(false);
  const callbacksRef = useRef({ onPersist: null, onFinish: null });

  const setTimeLeft = useCallback((value) => {
    const next =
      typeof value === "function" ? value(timeLeftRef.current) : value;
    timeLeftRef.current = next;
    setTimeLeftState(next);
  }, []);

  const reset = useCallback(
    (seconds) => {
      setIsRunning(false);
      isRunningRef.current = false;
      setTimeLeft(Math.max(seconds, 0));
    },
    [setTimeLeft],
  );

  // Persist unsaved progress when leaving mid-run.
  useEffect(
    () => () => {
      if (isRunningRef.current) {
        callbacksRef.current.onPersist?.(timeLeftRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isRunning) return;

    let ticks = 0;
    const interval = setInterval(() => {
      ticks += 1;
      const next = Math.max(timeLeftRef.current - 1, 0);
      timeLeftRef.current = next;
      setTimeLeftState(next);

      if (next <= 0) {
        clearInterval(interval);
        setIsRunning(false);
        isRunningRef.current = false;
        callbacksRef.current.onFinish?.();
      } else if (ticks % persistInterval === 0) {
        callbacksRef.current.onPersist?.(next);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, persistInterval]);

  const start = useCallback((handlers) => {
    if (handlers) callbacksRef.current = handlers;
    setIsRunning(true);
    isRunningRef.current = true;
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    isRunningRef.current = false;
    callbacksRef.current.onPersist?.(timeLeftRef.current);
  }, []);

  return { timeLeft, isRunning, start, pause, reset, setTimeLeft };
}

export default useTaskTimer;
