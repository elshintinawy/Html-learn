// project-details.js (المعدل بالكامل لدعم حذف الصور و PDF)
document.addEventListener("DOMContentLoaded", () => {
  const projectNameHeader = document.getElementById("project-name-header");
  if (!projectNameHeader) return;

  const mainContent = document.querySelector(".main-content");
  const mediaTabContent = document.getElementById("media-tab");
  const token = localStorage.getItem("loggedInUserToken");
  const activityCode = new URLSearchParams(window.location.search).get("code");
  const API_BASE_URL = "http://localhost:4000";

  let mediaToDelete = { type: null, path: null };

  function showToast(message, type = "success") {
    const toastContainer = document.querySelector(".toast-container");
    const toastId = "toast-" + Math.random().toString(36).substr(2, 9);
    const toastColor = type === "success" ? "bg-success" : "bg-danger";
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${toastColor} border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>`;
    toastContainer.insertAdjacentHTML("beforeend", toastHTML);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
  }

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

    const descriptionEl = document.getElementById("activityDescription");
    if (descriptionEl) {
      descriptionEl.textContent = project.activityDescription || "لا يوجد وصف";
    }

    const locationLink = document.getElementById("project-location-link");
    const noLocationMsg = document.getElementById("no-location-msg");

    if (locationLink && noLocationMsg) {
      if (
        project.projectLocationLink &&
        project.projectLocationLink.trim() !== ""
      ) {
        locationLink.href = project.projectLocationLink;
        locationLink.style.display = "inline-block";
        noLocationMsg.style.display = "none";
      } else {
        locationLink.style.display = "none";
        noLocationMsg.style.display = "block";
      }
    }
  }

  function renderImages(imagePaths = []) {
    if (!mediaTabContent) return;
    const section = document.createElement("div");
    section.innerHTML = "<h6 class='mt-4'>صور المشروع:</h6>";

    if (imagePaths.length === 0) {
      section.innerHTML += "<p class='text-muted text-center'>لا توجد صور</p>";
    } else {
      const row = document.createElement("div");
      row.className = "row g-3";

      imagePaths.forEach((imgPath) => {
        const fullImageUrl = `${API_BASE_URL}/${imgPath.replace(/\\/g, "/")}`;
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
    <div class="position-relative">
      <a href="${fullImageUrl}" target="_blank">
  <img src="${fullImageUrl}" 
       class="img-fluid rounded shadow-sm zoom-hover" 
       style="height:200px; object-fit:cover; width: 100%;" />
</a>
      <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 delete-img-btn" 
              data-path="${imgPath}" 
              data-bs-toggle="modal" 
              data-bs-target="#confirmDeleteModal">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
        row.appendChild(col);
      });

      section.appendChild(row);
    }

    mediaTabContent.appendChild(section);
  }

  function renderPDFs(pdfFiles = []) {
    const section = document.createElement("div");
    section.innerHTML = "<h6 class='mt-4'>ملفات PDF:</h6>";

    if (!Array.isArray(pdfFiles) || pdfFiles.length === 0) {
      section.innerHTML +=
        "<p class='text-muted text-center'>لا توجد ملفات PDF</p>";
    } else {
      const list = document.createElement("ul");
      list.className = "list-group";

      pdfFiles.forEach((pdf) => {
        const fullUrl = `${API_BASE_URL}/${pdf.path.replace(/\\/g, "/")}`;
        const item = document.createElement("li");
        item.className =
          "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
            <span>${pdf.filename}</span>
            <div>
              <a href="${fullUrl}" target="_blank" class="btn btn-sm btn-outline-primary me-2">عرض / تحميل</a>
              <button class="btn btn-sm btn-outline-danger delete-pdf-btn" data-path="${pdf.path}" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">حذف</button>
            </div>
          `;
        list.appendChild(item);
      });

      section.appendChild(list);
    }

    mediaTabContent.appendChild(section);
  }

  // ✅ تم تعديل هذه الجزئية لتعمل سواءً على الزر أو الأيقونة اللي جواه
  document.addEventListener("click", (e) => {
    const pdfBtn = e.target.closest(".delete-pdf-btn");
    const imgBtn = e.target.closest(".delete-img-btn");

    if (pdfBtn) {
      mediaToDelete = { type: "pdf", path: pdfBtn.dataset.path };
    } else if (imgBtn) {
      mediaToDelete = { type: "image", path: imgBtn.dataset.path };
    }
  });

  document
    .getElementById("confirmDeleteMediaBtn")
    .addEventListener("click", async () => {
      if (!activityCode || !mediaToDelete.path) return;

      const url = `${API_BASE_URL}/activity/${
        mediaToDelete.type === "pdf" ? "delete-pdf" : "delete-image"
      }`;

      const body = JSON.stringify({
        activityCode,
        [`${mediaToDelete.type}Path`]: mediaToDelete.path,
      });

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body,
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "فشل في الحذف");

        showToast("تم الحذف بنجاح");
        bootstrap.Modal.getInstance(
          document.getElementById("confirmDeleteModal")
        ).hide();
        initializePage();
      } catch (err) {
        showToast("فشل في الحذف: " + err.message, "danger");
      } finally {
        mediaToDelete = { type: null, path: null };
      }
    });

  async function initializePage() {
    if (!activityCode) {
      displayError("لم يتم تحديد كود المشروع.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/activity/${activityCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("فشل في تحميل بيانات المشروع.");

      const result = await response.json();
      renderProjectDetails(result.data);
      mediaTabContent.innerHTML = "";
      renderImages(result.data.images || []);
      renderPDFs(result.data.activityPdf || []);
    } catch (err) {
      displayError(err.message);
    }
  }

  initializePage();
  document.addEventListener("click", (e) => {
    const targetImg = e.target.closest(".previewable-img");
    if (targetImg) {
      const previewModal = new bootstrap.Modal(
        document.getElementById("imagePreviewModal")
      );
      const previewImage = document.getElementById("previewImage");
      previewImage.src = targetImg.dataset.full;
      previewModal.show();
    }
  });
});
