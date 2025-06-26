document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.querySelector(".main-content");
  const pageTitle = document.getElementById("project-name-header");
  const formContainer = document.getElementById("form-container");

  function getProjectCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
  }

  function renderProjectDetails(project) {
    if (pageTitle)
      pageTitle.textContent = `تفاصيل مشروع: ${project.activityName}`;

    document.getElementById("activityCode").textContent =
      project.activityCode || "N/A";

    document.getElementById("executingCompany").textContent =
      project.executingCompany || "N/A";
    document.getElementById("governorate").textContent =
      project.governorate || "N/A";
    document.getElementById("consultant").textContent =
      project.consultant || "N/A";

    document.getElementById("estimatedValue").textContent = `${(
      project.estimatedValue || 0
    ).toLocaleString()} جنيه`;
    document.getElementById("contractualValue").textContent = `${(
      project.contractualValue || 0
    ).toLocaleString()} جنيه`;
    document.getElementById("disbursedAmount").textContent = `${(
      project.disbursedAmount || 0
    ).toLocaleString()} جنيه`;

    document.getElementById("assignmentDate").textContent =
      project.assignmentDate
        ? new Date(project.assignmentDate).toLocaleDateString("ar-EG")
        : "N/A";
    document.getElementById("completionDate").textContent =
      project.completionDate
        ? new Date(project.completionDate).toLocaleDateString("ar-EG")
        : "N/A";

    let statusColorClass = "bg-secondary";
    const projectStatus = project.status || "قيد التنفيذ";

    switch (projectStatus) {
      case "قيد التنفيذ":
        statusColorClass = "bg-primary";
        break;
      case "مكتمل":
        statusColorClass = "bg-success";
        break;
      case "متأخر":
        statusColorClass = "bg-danger";
        break;
    }
    document.getElementById(
      "status"
    ).innerHTML = `<span class="badge ${statusColorClass} p-2">${projectStatus}</span>`;
  }

  function displayError(message) {
    const container = formContainer || mainContent;
    if (container)
      container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }

  async function fetchAndRenderProject() {
    const projectCode = getProjectCodeFromUrl();
    if (!projectCode) {
      displayError("لم يتم تحديد معرّف المشروع.");
      return;
    }

    const API_URL = `http://localhost:4000/activity/${projectCode}`;
    const token = localStorage.getItem("loggedInUserToken");

    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.data || "فشل جلب بيانات المشروع.");
      }

      renderProjectDetails(result.data);
    } catch (error) {
      console.error("حدث خطأ:", error);
      displayError(error.message);
    }
  }

  // تأكد من أننا في الصفحة الصحيحة قبل تشغيل الكود
  if (document.getElementById("project-name-header")) {
    fetchAndRenderProject();
  }
});
