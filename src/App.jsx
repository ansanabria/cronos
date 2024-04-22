import { useState, useEffect, useRef } from "react";
import {
  timeToSeconds,
  secondsToTime,
  simplifyTime,
  timeToString,
  stringToTime,
  determineRenders,
} from "./helpers";
import alarm from "./data/alarm.mp3";
import GlobalWrapper from "./GlobalWrapper";
import { TimeNumber } from "./components/TimeNumber";

const DEFAULT_TIME = {
  hours: 0,
  minutes: 30,
  seconds: 0,
};

const INDEX_SYMBOL = {
  0: "h",
  1: "m",
  2: "s",
};

const App = () => {
  const [counting, setCounting] = useState(false);
  const [formattedTime, setFormattedTime] = useState(DEFAULT_TIME);
  const timeLimit = timeToSeconds(formattedTime);
  const timeString = timeToString(formattedTime);
  const [isSetting, setIsSetting] = useState(false);
  const timeArray = Object.values(formattedTime);
  const booleanArray = determineRenders(formattedTime);
  const singleDigitIx = booleanArray.findIndex((bool) => bool);
  const audioRef = useRef(null);
  const clickedRef = useRef(false);
  const inputRef = useRef(null);

  if (counting) {
    document.title = simplifyTime(formattedTime);
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  function handleInput(event) {
    const newChar = event.nativeEvent.data;
    setFormattedTime((prevFormattedTime) => {
      let timeString = timeToString(prevFormattedTime);
      if (newChar) {
        timeString = timeString.slice(1).padEnd(6, newChar);
      } else {
        timeString = timeString.slice(0, -1).padStart(6, "0");
      }
      return stringToTime(timeString);
    });
  }

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
    } else {
      document.title = "Cronos";
    }

    return () => {
      if (timerWorker) {
        timerWorker.terminate();
      }
    };
  }, [counting]);

  useEffect(() => {
    if (isSetting) {
      inputRef.current.focus();
      setFormattedTime({ hours: 0, minutes: 0, seconds: 0 });
      setCounting(false);
    }
  }, [isSetting]);

  return (
    <GlobalWrapper>
      <div className="mb-12 flex w-fit max-w-lg flex-col items-center gap-y-10">
        <h1 className="text-4xl">Cronos</h1>
        <div
          className={`flex select-none gap-x-4 text-8xl hover:cursor-pointer ${isSetting ? "text-white/50" : ""}`}
          onMouseDown={() => {
            if (isSetting) {
              clickedRef.current = true;
            }
          }}
          onClick={() => {
            if (isSetting) {
              setFormattedTime(({ hours, minutes, seconds }) => {
                if (hours === 0 && minutes === 0 && seconds === 0) {
                  return DEFAULT_TIME;
                }
                return secondsToTime(
                  timeToSeconds({ hours, minutes, seconds }),
                );
              });
            }
            setIsSetting((prevIsSetting) => !prevIsSetting);
          }}
        >
          {
            <>
              {booleanArray.map(
                (doesRender, ix) =>
                  (doesRender || isSetting) && (
                    <TimeNumber
                      key={Math.random()}
                      time={timeArray[ix]}
                      symbol={INDEX_SYMBOL[ix]}
                      singleDigit={ix === singleDigitIx && !isSetting}
                    />
                  ),
              )}
              <input
                className="absolute h-0 w-0"
                value={timeString}
                ref={inputRef}
                onChange={handleInput}
                onBlur={() => {
                  if (clickedRef.current) {
                    clickedRef.current = false;
                  } else {
                    setIsSetting(false);
                  }
                }}
              />
            </>
          }
        </div>
        <div className="flex gap-x-4">
          <button
            className="rounded-sm bg-white px-4 py-2 text-xl font-medium text-slate-900 transition-transform hover:scale-110 active:opacity-70"
            onClick={() => {
              setCounting((prevCounting) => !prevCounting);
              setIsSetting(false);
            }}
          >
            {counting ? "Stop" : "Start"}
          </button>
          <button
            className="rounded-sm bg-white px-4 py-2 text-xl font-medium text-slate-900 transition-transform hover:scale-110 active:opacity-70"
            onClick={() => {
              setCounting(false);
              setIsSetting(false);
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
