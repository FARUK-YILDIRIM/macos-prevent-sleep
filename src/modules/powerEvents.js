const { powerMonitor } = require("electron");

function listenToPowerEvents() {
  powerMonitor.on("suspend", () => {
    console.log("System is going to sleep");
  });

  powerMonitor.on("resume", () => {
    console.log("System is waking up");
  });
}

module.exports = {
  listenToPowerEvents,
};
