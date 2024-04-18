import { useState, useEffect, useRef } from "react";
import {
  timeToSeconds,
  secondsToTime,
  simplifyTime,
  formattedTimeDigit,
  timeToString,
  stringToTime,
} from "./helpers";
import alarm from "./data/alarm.mp3";
import GlobalWrapper from "./GlobalWrapper";

const App = () => {
  const DEFAULT_TIME = {
    hours: 0,
    minutes: 25,
    seconds: 0,
  };
  const [counting, setCounting] = useState(false);
  const [formattedTime, setFormattedTime] = useState(DEFAULT_TIME);
  const timeLimit = timeToSeconds(formattedTime);
  const [isSetting, setIsSetting] = useState(false);
  const { hours, minutes, seconds } = formattedTime;
  const audioRef = useRef(null);

  if (counting) {
    document.title = simplifyTime(formattedTime);
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    let timerWorker;

    if (counting) {
      const workerUrl = new URL("./helpers/timerWorker.js", import.meta.url);
      timerWorker = new Worker(workerUrl);
      timerWorker.postMessage(timeLimit);
      timerWorker.onmessage = (message) => {
        const newTime = secondsToTime(message.data);
        setFormattedTime(newTime);
        if (message.data === 0) {
          playAudio();
        }
      };
    }

    return () => {
      if (timerWorker) {
        timerWorker.terminate();
      }
    };
  }, [counting]);

  return (
    <GlobalWrapper>
      <div className="mb-12 flex w-fit max-w-lg flex-col items-center gap-y-10">
        <h1 className="text-4xl">Cronos</h1>
        <div
          className={`flex select-none gap-x-4 text-8xl hover:cursor-pointer ${isSetting ? "text-white/50" : ""}`}
          onClick={() =>
            setIsSetting((prevIsSetting) => {
              return !prevIsSetting;
            })
          }
        >
          {
            <>
              <div>
                {formattedTimeDigit(hours)}
                <span className="text-4xl">h</span>
              </div>
              <div>
                {formattedTimeDigit(minutes)}
                <span className="text-4xl">m</span>
              </div>
              <div>
                {formattedTimeDigit(seconds)}
                <span className="text-4xl">s</span>
              </div>
              <input
                className="hidden h-0 w-0"
                value={timeToString(formattedTime)}
                onChange={(e) => setFormattedTime(stringToTime(e.target.value))}
                autoFocus
              />
            </>
          }
        </div>
        <div className="flex gap-x-4">
          <button
            className="rounded-sm bg-white px-4 py-2 text-xl font-medium text-slate-900 transition-transform hover:scale-110 active:opacity-70"
            onClick={() => setCounting(true)}
          >
            Start
          </button>
          <button
            className="rounded-sm bg-white px-4 py-2 text-xl font-medium text-slate-900 transition-transform hover:scale-110 active:opacity-70"
            onClick={() => setCounting(false)}
          >
            Stop
          </button>
          <button
            className="rounded-sm bg-white px-4 py-2 text-xl font-medium text-slate-900 transition-transform hover:scale-110 active:opacity-70"
            onClick={() => {
              setCounting(false);
              setFormattedTime(DEFAULT_TIME);
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <audio ref={audioRef} src={alarm} preload="auto"></audio>
    </GlobalWrapper>
  );
};

export default App;
