document.addEventListener("DOMContentLoaded", () => {
  // التأكد من أننا في الصفحة الصحيحة
  const pageTitle = document.getElementById("page-title");
  if (!pageTitle) return;

  const formContainer = document.getElementById("form-container");
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("loggedInUserToken");

  // كائن الصلاحيات
  const permissions = {
    admin: [
      "activityCode",
      "activityName",
      "executingCompany",
      "consultant",
      "governorate",
      "fundingType",
      "projectCategory",
      "estimatedValue",
      "contractualValue",
      "disbursedAmount",
      "assignmentDate",
      "completionDate",
      "receptionDate",
      "executionStatus",
      "progress",
      "status",
      "images",
      "activityDescription",
    ],
    manager: [
      "activityName",
      "executingCompany",
      "consultant",
      "assignmentDate",
      "completionDate",
      "receptionDate",
      "executionStatus",
      "progress",
      "status",
      "images",
      "activityDescription",
    ],
    financial: ["estimatedValue", "contractualValue", "disbursedAmount"],
    employee: [],
  };
  const allowedFields = permissions[userRole] || [];

  // دالة لجلب كود المشروع من الرابط
  function getProjectCodeFromUrl() {
    return new URLSearchParams(window.location.search).get("code");
  }

  // دالة لإظهار الإشعارات المنبثقة (Toasts)
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
    if (toastContainer) {
      toastContainer.insertAdjacentHTML("beforeend", toastHTML);
      const toastElement = document.getElementById(toastId);
      const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
      toast.show();
    }
  }

  // دالة لرسم النموذج وتطبيق الصلاحيات
  function renderForm(project) {
    formContainer.innerHTML = `
            <form id="editProjectForm">
                <div class="row g-3">
                    <h5 class="form-section-title">البيانات الأساسية</h5>
                    <div class="col-md-6"><label for="activityName" class="form-label">اسم المشروع</label><input type="text" id="activityName" class="form-control" value="${
                      project.activityName || ""
                    }"></div>
                    <div class="col-md-6"><label for="executingCompany" class="form-label">الشركة المنفذة</label><input type="text" id="executingCompany" class="form-control" value="${
                      project.executingCompany || ""
                    }"></div>
                    <div class="col-md-6"><label for="consultant" class="form-label">الاستشاري</label><input type="text" id="consultant" class="form-control" value="${
                      project.consultant || ""
                    }"></div>
                    <div class="col-md-6"><label for="status" class="form-label">حالة المشروع</label><select id="status" class="form-select"><option value="قيد التنفيذ">قيد التنفيذ</option><option value="مكتمل">مكتمل</option><option value="متأخر">متأخر</option></select></div>
                   
                    <div class="col-md-12">
                    <label for="description" class="form-label">وصف المشروع</label>
                    <textarea id="activityDescription" class="form-control" rows="4" style="resize: vertical; overflow:auto;">${
                      project.activityDescription || ""
                    }</textarea> 
                    </div>

                    <h5 class="form-section-title">البيانات المالية والزمنية</h5>
                    <div class="col-md-4"><label for="estimatedValue" class="form-label">القيمة التقديرية</label><input type="number" id="estimatedValue" class="form-control" value="${
                      project.estimatedValue || 0
                    }"></div>
                    <div class="col-md-4"><label for="contractualValue" class="form-label">القيمة التعاقدية</label><input type="number" id="contractualValue" class="form-control" value="${
                      project.contractualValue || 0
                    }"></div>
                    <div class="col-md-4"><label for="disbursedAmount" class="form-label">المنصرف</label><input type="number" id="disbursedAmount" class="form-control" value="${
                      project.disbursedAmount || 0
                    }"></div>
                    <div class="col-md-4"><label for="progress" class="form-label">نسبة الإنجاز</label><input type="number" id="progress" class="form-control" value="${
                      project.progress || 0
                    }"></div>
                    <div class="col-md-4"><label for="completionDate" class="form-label">تاريخ النهو</label><input type="date" id="completionDate" class="form-control" value="${
                      project.completionDate
                        ? new Date(project.completionDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }"></div>
                    <div class="col-md-4"><label for="receptionDate" class="form-label">تاريخ الاستلام</label><input type="date" id="receptionDate" class="form-control" value="${
                      project.receptionDate
                        ? new Date(project.receptionDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }"></div>
                        <div class="col-md-12">
                              <label for="projectImages" class="form-label">رفع صور المشروع</label>
                              <input type="file" id="images" name="images" class="form-control" multiple accept="image/*">
                            </div>
                    <div class="col-12 mt-4 text-center">
                        <button type="submit" class="btn btn-primary px-4" id="save-changes-button">حفظ التعديلات</button>
                    </div>
                </div>
            </form>
        `;
    document.getElementById("status").value = project.status || "قيد التنفيذ";

    const allInputs = formContainer.querySelectorAll("input, select");
    allInputs.forEach((input) => {
      if (
        input.id &&
        !allowedFields.includes(input.id) &&
        input.type !== "images"
      ) {
        input.disabled = true;
      }
    });

    attachSubmitListener(project.activityCode);
  }

  function attachSubmitListener(activityCode) {
    const editForm = document.getElementById("editProjectForm");
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveButton = document.getElementById("save-changes-button");
      saveButton.disabled = true;
      saveButton.innerHTML = "جاري الحفظ...";

      const formData = new FormData();

      allowedFields.forEach((fieldId) => {
        const input = document.getElementById(fieldId);
        if (input) {
          formData.append(fieldId, input.value);
        }
      });

      const imageInput = document.getElementById("images");
      if (imageInput && imageInput.files.length > 0) {
        for (let i = 0; i < imageInput.files.length; i++) {
          formData.append("images", imageInput.files[i]);
        }
      }

      try {
        const response = await fetch(
          `http://localhost:4000/activity/${activityCode}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const result = await response.json();
        console.log(result);
        if (!response.ok) throw new Error(result.data || "فشل تحديث المشروع");

        showToast("تم حفظ التعديلات بنجاح!", "success");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 2000);
      } catch (error) {
        showToast(`خطأ: ${error.message}`, "danger");
        saveButton.disabled = false;
        saveButton.innerHTML = "حفظ التعديلات";
      }
    });
  }

  // الدالة الرئيسية التي تبدأ كل شيء
  async function initializePage() {
    const activityCode = getProjectCodeFromUrl();
    if (!activityCode) {
      formContainer.innerHTML = `<div class="alert alert-danger">كود المشروع غير موجود.</div>`;
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/activity/${activityCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.data);
      pageTitle.textContent = `تعديل مشروع: ${result.data.activityName}`;
      renderForm(result.data);
    } catch (error) {
      formContainer.innerHTML = `<div class="alert alert-danger">فشل في جلب بيانات المشروع: ${error.message}</div>`;
    }
  }

  initializePage();
});

/* const permissions = {
    admin: [
      "activityCode",
      "activityName",
      "executingCompany",
      "consultant",
      "governorate",
      "fundingType",
      "projectCategory",
      "estimatedValue",
      "contractualValue",
      "disbursedAmount",
      "assignmentDate",
      "completionDate",
      "receptionDate",
      "executionStatus",
      "progress",
      "status",
    ],
    manager: [
      "activityName",
      "executingCompany",
      "consultant",
      "assignmentDate",
      "completionDate",
      "receptionDate",
      "executionStatus",
      "progress",
      "status",
    ],
    financial: ["estimatedValue", "contractualValue", "disbursedAmount"],
    employee: [],
  }; */
