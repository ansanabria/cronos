const startBtn = document.querySelector("#start-btn");
const resetBtn = document.querySelector("#reset-btn");
const minuteText = document.querySelector("#minutes");
const secondText = document.querySelector("#seconds");

// These operations are done for later manipulation by
// event listeners
const DEFAULT_MINUTE = 0;
const DEFAULT_SECOND = 5;
const minutesAsMs = DEFAULT_MINUTE * 60 * 1_000;
const secondsAsMs = DEFAULT_SECOND * 1_000;
const totalMs = minutesAsMs + secondsAsMs;
let timeLeft = totalMs;
let timerId;
let timeoutId;

startBtn.addEventListener("click", () => {
  timerId = setInterval(() => {
    timeLeft -= 1000;
    const rawMinute = timeLeft / 1_000 / 60;
    const minute = Math.floor(rawMinute);
    const second = Math.round((rawMinute - minute) * 60);
    minuteText.textContent = minute.toString().padStart(2, "0");
    secondText.textContent = second.toString().padStart(2, "0");
  }, 1000);
  timeoutId = setTimeout(() => {
    clearInterval(timerId);
  }, totalMs);
});

resetBtn.addEventListener("click", () => {
  if (timerId && timeoutId) {
    clearInterval(timerId);
    clearTimeout(timeoutId);
  }
  timeLeft = totalMs;
});
