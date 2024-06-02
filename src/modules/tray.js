const { Tray, Menu, app } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let tray = null;
let isSleepPreventionEnabled = false;
let caffeinateProcess = null;

function createTray() {
  tray = new Tray(getTrayIcon());
  updateTrayMenu();
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isSleepPreventionEnabled ? "Allow Sleep" : "Prevent Sleep",
      click: () => {
        toggleSleepPrevention();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        if (isSleepPreventionEnabled) {
          disableSleepPrevention();
        }
        app.quit();
      },
    },
  ]);

  tray.setToolTip("MacOS Prevent Sleep");
  tray.setContextMenu(contextMenu);
}

function toggleSleepPrevention() {
  if (!isSleepPreventionEnabled) {
    enableSleepPrevention();
  } else {
    disableSleepPrevention();
  }

  tray.setImage(getTrayIcon());
  updateTrayMenu();
}

function enableSleepPrevention() {
  caffeinateProcess = exec("caffeinate", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });

  if (caffeinateProcess) {
    isSleepPreventionEnabled = true;
    console.log("Preventing sleep enabled.");
  } else {
    console.log("Failed to enable sleep prevention.");
  }
}

function disableSleepPrevention() {
  if (caffeinateProcess) {
    caffeinateProcess.kill();
    caffeinateProcess = null;
    isSleepPreventionEnabled = false;
    console.log("Preventing sleep disabled.");
  }
}

function getTrayIcon() {
  return isSleepPreventionEnabled
    ? path.join(__dirname, "../../", "assets", "icon-on.png")
    : path.join(__dirname, "../../", "assets", "icon-off.png");
}

module.exports = {
  createTray,
};
