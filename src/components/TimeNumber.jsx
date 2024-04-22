import { formattedTimeDigit } from "../helpers";

export function TimeNumber({ time, symbol, singleDigit }) {
  return (
    <div key={Math.random()}>
      {singleDigit ? time : formattedTimeDigit(time)}
      <span className="text-4xl">{symbol}</span>
    </div>
  );
}
