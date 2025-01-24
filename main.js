require("dotenv").config();

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const sqlite = require("sqlite-electron");
const { open } = require("./services/document");
const { ps } = require("./services/terminal");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("./views/loading.html");
};

app.whenReady().then(async () => {
  await sqlite.setdbPath("./persistence/data-manager.db");

  ipcMain.handle("get-courses", async () => {
    return await sqlite.fetchAll("SELECT * FROM Courses ORDER BY Name");
  });

  ipcMain.handle("get-sections", async (event, courseId) => {
    return await sqlite.fetchAll("SELECT * FROM Sections WHERE CourseId = ?", [
      courseId,
    ]);
  });

  ipcMain.handle("get-lessons", async (event, sectionIds) => {
    let query = "SELECT * FROM Lessons WHERE SectionId IN (";
    for (let i = 0; i < sectionIds.length; i++) {
      if (i === sectionIds.length - 1) {
        query = query + "?)";
      } else {
        query = query + "?,";
      }
    }

    return await sqlite.fetchAll(query, sectionIds);
  });

  ipcMain.on("open-lesson", async (event, courseName, lessonInCourseId) => {
    mainWindow.blur();
    open(courseName, lessonInCourseId);
  });

  ps.stdout.on("data", (data) => {
    if (data.toString().includes("Word is initialized.")) {
      mainWindow.loadFile("./views/index.html");
    }
  });

  ps.stdin.write("$wordApp = New-Object -ComObject Word.Application\n");
  ps.stdin.write(
    `while (-not $wordApp.Name) { Start-Sleep -Seconds 2 };Write-Output "Word is initialized."\n`
  );
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", async () => {
  if (process.platform !== "darwin") {
    await closeWordAppAndKillTerminal();
    console.log("Powershell child process successfully terminated.");
    app.quit();
  }
});

async function closeWordAppAndKillTerminal() {
  return new Promise((resolve) => {
    const closeOpenDocuments = `foreach ($document in $wordApp.Documents) { $document.Close() }\n`;
    const quitWordApp = `try { $wordApp.Quit() } catch { Write-Output "WordApp was already quitted." }\n`;
    ps.stdin.write(closeOpenDocuments + quitWordApp);

    ps.stdin.end();

    ps.on("close", () => {
      resolve();
    });
  });
}
