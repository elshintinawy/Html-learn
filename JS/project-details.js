document.addEventListener("DOMContentLoaded", () => {
  const projectNameHeader = document.getElementById("project-name-header");
  if (!projectNameHeader) return;

  const mainContent = document.querySelector(".main-content");
  const mediaTabContent = document.getElementById("media-tab");
  const token = localStorage.getItem("loggedInUserToken");
  const activityCode = new URLSearchParams(window.location.search).get("code");
  const API_BASE_URL = "http://localhost:4000";

  function displayError(message) {
    projectNameHeader.textContent = "حدث خطأ";
    const cardBody = document.querySelector(".card-body");
    if (cardBody) {
      cardBody.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
  }

  function renderProjectDetails(project) {
    projectNameHeader.textContent = `تفاصيل مشروع: ${project.activityName}`;
    const setText = (id, value, fallback = "N/A") => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || fallback;
    };
    setText("activityCode", project.activityCode);
    setText("executingCompany", project.executingCompany);
    setText("governorate", project.governorate);
    setText("consultant", project.consultant);
    setText(
      "activityDescription",
      project.activityDescription,
      "لا يوجد وصف للمشروع."
    );
    setText(
      "estimatedValue",
      (project.estimatedValue || 0).toLocaleString() + " جنيه"
    );
    setText(
      "contractualValue",
      (project.contractualValue || 0).toLocaleString() + " جنيه"
    );
    setText(
      "disbursedAmount",
      (project.disbursedAmount || 0).toLocaleString() + " جنيه"
    );
    setText(
      "assignmentDate",
      project.assignmentDate
        ? new Date(project.assignmentDate).toLocaleDateString("ar-EG")
        : "N/A"
    );
    setText(
      "completionDate",
      project.completionDate
        ? new Date(project.completionDate).toLocaleDateString("ar-EG")
        : "N/A"
    );

    const statusElement = document.getElementById("status");
    if (statusElement) {
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
      statusElement.innerHTML = `<span class="badge ${statusColorClass} p-2">${projectStatus}</span>`;
    }
  }

  function renderImages(imagePaths = []) {
    if (!mediaTabContent) return;
    mediaTabContent.innerHTML = "";

    if (imagePaths.length === 0) {
      mediaTabContent.innerHTML =
        '<p class="text-muted text-center p-4">لا توجد وسائط لعرضها حاليًا.</p>';
      return;
    }

    const imageRow = document.createElement("div");
    imageRow.className = "row g-3";

    imagePaths.forEach((imagePath) => {
      const fullImageUrl = `${API_BASE_URL}/${imagePath.replace(/\\/g, "/")}`;

      const imageCol = document.createElement("div");
      imageCol.className = "col-lg-4 col-md-6 col-12";
      imageCol.innerHTML = `
        <a href="${fullImageUrl}" target="_blank" title="اضغط لتكبير الصورة">
          <img src="${fullImageUrl}" class="img-fluid rounded shadow-sm" alt="صورة مشروع" style="width: 100%; height: 200px; object-fit: cover;">
        </a>
      `;
      imageRow.appendChild(imageCol);
    });

    mediaTabContent.appendChild(imageRow);
  }

  async function initializePage() {
    if (!activityCode) {
      displayError("لم يتم تحديد كود المشروع.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/activity/${activityCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.data || errorData.message || "فشل في جلب بيانات المشروع."
        );
      }

      const result = await response.json();
      const projectData = result.data;

      if (!projectData || typeof projectData !== "object") {
        throw new Error("شكل البيانات المستلمة من السيرفر غير صحيح أو فارغ.");
      }

      renderProjectDetails(projectData);
      renderImages(projectData.images);
    } catch (error) {
      console.error("حدث خطأ في تهيئة الصفحة:", error);
      displayError(error.message);
    }
  }

  initializePage();
});
