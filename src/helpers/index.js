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
  return {
    hours: Number(string.slice(0, 2)),
    minutes: Number(string.slice(2, 4)),
    seconds: Number(string.slice(4)),
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

export function determineRenders(time) {
  const valuesArray = Object.values(time);
  let render = false;
  const booleanArray = [];
  for (let ix = 0; ix < valuesArray.length; ix++) {
    const digit = valuesArray[ix];
    let prevDigit = -1;
    if (ix === 0) {
      prevDigit = valuesArray[ix - 1];
    }
    if ((digit > 0 && prevDigit !== 0) || render) {
      booleanArray.push(true);
      render = true;
    } else {
      booleanArray.push(false);
    }
  }
  booleanArray.pop();
  booleanArray.push(true);
  return booleanArray;
}
