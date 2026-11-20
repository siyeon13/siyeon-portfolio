// 프로젝트 메뉴는 내용이 검증된 페이지만 보여 주며, 링크 해시는 현재 선택을 유지한다.
const projectTabs = [...document.querySelectorAll("[data-project]")];
const projectPanels = [...document.querySelectorAll(".project-panel")];
const sectionNav = document.querySelector(".section-nav");

function showProject(project, updateHash = true) {
  const selected = projectTabs.some((tab) => tab.dataset.project === project) ? project : "playball";

  for (const tab of projectTabs) {
    const active = tab.dataset.project === selected;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  }

  for (const panel of projectPanels) {
    panel.hidden = panel.id !== "panel-" + selected;
  }

  sectionNav.hidden = selected !== "playball";
  if (updateHash) {
    history.replaceState(null, "", "#project-" + selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

for (const tab of projectTabs) {
  tab.addEventListener("click", () => showProject(tab.dataset.project));
  tab.addEventListener("keydown", (event) => {
    const index = projectTabs.indexOf(tab);
    const nextIndex = event.key === "ArrowRight" ? (index + 1) % projectTabs.length
      : event.key === "ArrowLeft" ? (index - 1 + projectTabs.length) % projectTabs.length
      : null;
    if (nextIndex !== null) {
      event.preventDefault();
      projectTabs[nextIndex].focus();
      showProject(projectTabs[nextIndex].dataset.project);
    }
  });
}

const initialProject = window.location.hash.replace("#project-", "");
if (["playball", "codeverse", "spring"].includes(initialProject)) {
  showProject(initialProject, false);
}

for (const link of document.querySelectorAll(".section-nav a")) {
  link.addEventListener("click", () => {
    for (const item of document.querySelectorAll(".section-nav a")) {
      item.classList.toggle("is-current", item === link);
    }
  });
}

// 로고를 누르면 다른 프로젝트 화면에서도 Playball 첫 화면으로 돌아간다.
document.querySelector(".identity").addEventListener("click", (event) => {
  event.preventDefault();
  showProject("playball");
});
