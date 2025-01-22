const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getCourses: () => ipcRenderer.invoke("get-courses"),
  getSections: (courseId) => ipcRenderer.invoke("get-sections", courseId),
  getLessons: (sectionIds) => ipcRenderer.invoke("get-lessons", sectionIds),
  openLesson: (courseName, lessonInCourseId) =>
    ipcRenderer.send("open-lesson", courseName, lessonInCourseId),
});
