self.onmessage = function (message) {
  let time = message.data;
  const intervalId = setInterval(() => {
    time -= 1;
    postMessage(time);
    if (time === 0) {
      clearInterval(intervalId);
    }
  }, 1000);
};
