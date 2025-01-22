document.addEventListener("DOMContentLoaded", async () => {
  const courses = await window.electronAPI.getCourses();

  const selectElement = document.getElementById("courses");
  courses.map((course) => {
    const option = document.createElement("option");
    option.value = course.Id;
    option.textContent = course.Name;
    selectElement.appendChild(option);
  });

  selectElement.addEventListener("change", async (event) => {
    const divElement = document.getElementById("lessons-container");
    divElement.innerHTML = "";

    if (event.target.value) {
      const courseName = event.target.options[event.target.selectedIndex].text;
      const sections = await window.electronAPI.getSections(event.target.value);

      const sectionIds = [];
      sections.forEach((section) => sectionIds.push(String(section.Id)));

      const lessons = await window.electronAPI.getLessons(sectionIds);

      sections.forEach((section) => {
        const filteredLessons = lessons.filter(
          (lesson) => lesson.SectionId === section.Id
        );

        const h1 = document.createElement("h1");
        h1.textContent = section.Name;

        const ulElement = document.createElement("ul");
        filteredLessons.forEach((lesson) => {
          const liElement = document.createElement("li");
          const btn = document.createElement("button");
          btn.textContent = lesson.Name;
          btn.lessonValue = lesson.LessonInCourseId;
          ulElement.appendChild(liElement);
          liElement.appendChild(btn);
        });

        divElement.appendChild(h1);
        divElement.appendChild(ulElement);
      });

      divElement.style.overflowY = "scroll";
      divElement.style.display = "block";

      const divHeight =
        window.innerHeight - divElement.getBoundingClientRect().top - 35;
      divElement.style.height = `${divHeight}px`;

      const uls = document.querySelectorAll("ul");
      uls.forEach((ul) => {
        ul.addEventListener("click", async (event) => {
          if (event.target.tagName === "BUTTON") {
            const lessonInCourseId = event.target.lessonValue;
            await window.electronAPI.openLesson(courseName, lessonInCourseId);
          }
        });
      });
    } else {
      divElement.style.display = "none";
    }
  });
});
