import { useState, useEffect, useRef } from "react";
import {
  clearTiming,
  timeToSeconds,
  secondsToTime,
  simplifyTime,
} from "./helper/helpers";
import alarm from "./data/alarm.mp3";
import GlobalWrapper from "./GlobalWrapper";
import useSound from "use-sound";

const DEFAULT_TIME = {
  hours: 0,
  minutes: 25,
  seconds: 0,
};

const App = () => {
  const [counting, setCounting] = useState(false);
  const [formattedTime, setFormattedTime] = useState(DEFAULT_TIME);
  const timeLimit = timeToSeconds(formattedTime);
  const { hours, minutes, seconds } = formattedTime;
  const intervalId = useRef(0);
  const timeoutId = useRef(0);
  const [play, { stop }] = useSound(alarm);

  useEffect(() => {
    if (counting) {
      intervalId.current = setInterval(() => {
        setFormattedTime((prevFormattedTime) => {
          const newTimeInSeconds = timeToSeconds(prevFormattedTime) - 1;
          const newTime = secondsToTime(newTimeInSeconds);
          document.title = simplifyTime(newTime);
          return newTime;
        });
      }, 1000);
      timeoutId.current = setTimeout(() => {
        play();
        setTimeout(stop, 5000);
        clearInterval(intervalId);
        setCounting(false);
      }, timeLimit * 1000);
      return () => clearTiming(intervalId, timeoutId);
    } else {
      clearTiming(intervalId, timeoutId);
    }
  }, [counting]);

  return (
    <GlobalWrapper>
      <div className="mb-12 flex w-fit flex-col items-center gap-y-10">
        <h1 className="text-2xl">Cronos</h1>
        <div className="flex gap-x-4 text-6xl">
          {hours > 0 && (
            <div>
              {hours}
              <span className="text-xl">h</span>
            </div>
          )}
          {(hours > 0 || minutes > 0) && (
            <div>
              {minutes}
              <span className="text-xl">m</span>
            </div>
          )}
          <div>
            {seconds}
            <span className="text-xl">s</span>
          </div>
        </div>
        <div className="flex gap-x-4">
          <button
            className="rounded-sm bg-white px-3 py-1 font-medium text-slate-900 transition-transform hover:scale-110 active:opacity-70"
            onClick={() => setCounting(true)}
          >
            Start
          </button>
          <button
            className="rounded-sm bg-white px-3 py-1 font-medium text-slate-900 transition-transform hover:scale-110 active:opacity-70"
            onClick={() => setCounting(false)}
          >
            Stop
          </button>
          <button
            className="rounded-sm bg-white px-3 py-1 font-medium text-slate-900 transition-transform hover:scale-110 active:opacity-70"
            onClick={() => {
              setCounting(false);
              setFormattedTime(DEFAULT_TIME);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </GlobalWrapper>
  );
};

export default App;
