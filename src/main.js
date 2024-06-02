const { app, ipcMain } = require("electron");
const { createTray } = require("./modules/tray");
const { listenToPowerEvents } = require("./modules/powerEvents");

app.on("ready", () => {
  createTray();
  listenToPowerEvents();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("prevent-sleep", (event, arg) => {
  toggleSleepPrevention();
});

ipcMain.on("allow-sleep", (event, arg) => {
  toggleSleepPrevention();
});
