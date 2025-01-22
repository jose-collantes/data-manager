const { ps } = require("./terminal");
const path = require("path");

// const docsFolderPath = path.join(__dirname, "..", "assets/documents");
const docsFolderPath = path.join(
  __dirname,
  "..",
  "assets/documents_no-content"
);

function open(courseName, lessonNumber) {
  const docPath = path.join(docsFolderPath, courseName + ".docm");

  const checkIfWordAppIsOpen = `try { $wordApp.WindowState = 0 } catch { $wordApp = New-Object -ComObject Word.Application }\n`;
  const makeWordAppVisible =
    "if ($wordApp.Visible -eq $false ) { $wordApp.Visible = $true };$wordApp.WindowState = 2;$wordApp.WindowState = 0\n";
  const initializeDocVariable = "$wordDoc = $null\n";
  const getDocumentIfOpen = `for ($i = 1; $i -le $wordApp.Documents.Count; $i++) { if ($wordApp.Documents[$i].Name -like "${courseName}*") { $wordDoc = $wordApp.Documents[$i]; break; } }\n`;
  const openDocumentIfClosed = `if ($wordDoc -eq $null) { $wordDoc = $wordApp.Documents.Open("${docPath}") }\n`;
  const goToLesson = `$wordDoc.Activate();$lesson = $wordApp.Selection.GoTo(11, 1, ${lessonNumber})\n`;

  const statement =
    checkIfWordAppIsOpen +
    makeWordAppVisible +
    initializeDocVariable +
    getDocumentIfOpen +
    openDocumentIfClosed +
    goToLesson;

  ps.stdin.write(statement);
}

module.exports.open = open;
