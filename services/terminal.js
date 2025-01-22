const { spawn } = require("child_process");

const ps = spawn("powershell.exe", ["-NoExit", "-Command", "-"]);

// ps.stdout.on("data", (data) => {
//   console.log(`stdout: ${data}`);
// });

// ps.stderr.on("data", (data) => {
//   console.error(`stderr: ${data}`);
// });

module.exports.ps = ps;
