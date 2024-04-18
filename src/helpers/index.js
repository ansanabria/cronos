export function formattedTimeDigit(timeDigit) {
  return timeDigit.toString().padStart(2, "0");
}

export function timeToSeconds({ hours, minutes, seconds }) {
  const hourSeconds = hours * 3600;
  const minuteSeconds = minutes * 60;
  return hourSeconds + minuteSeconds + seconds;
}

export function secondsToTime(seconds) {
  let varSeconds = seconds;
  const hours = Math.floor(varSeconds / 3600);
  varSeconds = varSeconds % 3600;
  const minutes = Math.floor(varSeconds / 60);
  varSeconds = varSeconds % 60;
  return { hours, minutes, seconds: varSeconds };
}

export function timeToString(time) {
  return Object.values(time).map(formattedTimeDigit).join("");
}

export function stringToTime(string) {
  console.log(string);
  return {
    hours: Number(string.slice(2)),
    minutes: Number(string.slice(2, 4)),
    seconds: Number(string.slice(4, -1)),
  };
}

export function simplifyTime({ hours, minutes, seconds }) {
  let time = "";
  if (hours > 0) {
    time += `${hours}h `;
  }
  if (hours > 0 || minutes > 0) {
    time += `${minutes}m `;
  }
  time += `${seconds}s`;
  return time;
}
