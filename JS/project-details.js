document.addEventListener("DOMContentLoaded", () => {
  // الكود المشترك للتحقق من المستخدم موجود في main.js ويعمل أولاً

  const mainContent = document.querySelector(".main-content");

  // دالة لقراءة كود النشاط من رابط الصفحة
  function getProjectCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    // نقرأ الآن 'code' بدلاً من 'id'
    return params.get("code");
  }

  function renderProjectDetails(project) {
    // ... نفس دالة عرض البيانات كما هي ...
    document.getElementById(
      "project-name-header"
    ).textContent = `تفاصيل مشروع: ${project.activityName}`;
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
    document.getElementById(
      "status"
    ).innerHTML = `<span class="badge bg-success">${
      project.status || "قيد التنفيذ"
    }</span>`;
  }

  function displayError(message) {
    mainContent.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }

  async function fetchAndRenderProject() {
    const projectCode = getProjectCodeFromUrl();
    if (!projectCode) {
      displayError("لم يتم تحديد كود المشروع في الرابط.");
      return;
    }

    // بناء الرابط الصحيح الذي يتوقعه الباك اند
    const API_URL = `http://localhost:4000/activity/${projectCode}`;
    const token = localStorage.getItem("loggedInUserToken");

    try {
      console.log(`جاري طلب المشروع صاحب الكود: ${projectCode}`);
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.data || "فشل جلب بيانات المشروع.");
      }

      // نفترض أن الباك اند يعيد المشروع داخل data
      renderProjectDetails(result.data);
    } catch (error) {
      console.error("حدث خطأ:", error);
      displayError(error.message);
    }
  }

  fetchAndRenderProject();
});
