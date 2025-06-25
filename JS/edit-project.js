document.addEventListener("DOMContentLoaded", () => {
  const pageTitle = document.getElementById("page-title");
  const formContainer = document.getElementById("form-container");
  const token = localStorage.getItem("loggedInUserToken");

  function getProjectCodeFromUrl() {
    return new URLSearchParams(window.location.search).get("code");
  }

  // دالة لملء النموذج بالبيانات القادمة من السيرفر
  function populateForm(project) {
    // حقول النموذج
    document.getElementById("activityName").value = project.activityName || "";
    document.getElementById("executingCompany").value =
      project.executingCompany || "";
    document.getElementById("consultant").value = project.consultant || "";
    document.getElementById("disbursedAmount").value =
      project.disbursedAmount || 0;
    document.getElementById("progress").value = project.progress || 0;
    // تحويل التواريخ للصيغة الصحيحة لحقل الإدخال
    document.getElementById("completionDate").value = project.completionDate
      ? new Date(project.completionDate).toISOString().split("T")[0]
      : "";
    document.getElementById("receptionDate").value = project.receptionDate
      ? new Date(project.receptionDate).toISOString().split("T")[0]
      : "";
  }

  // دالة لربط حدث الإرسال بالنموذج
  function attachSubmitListener(activityCode) {
    const editForm = document.getElementById("editProjectForm");
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveButton = document.getElementById("save-changes-button");
      saveButton.disabled = true;
      saveButton.innerHTML = "جاري الحفظ...";

      // جمع البيانات من الحقول لإرسالها
      const updatedData = {
        activityName: document.getElementById("activityName").value,
        executingCompany: document.getElementById("executingCompany").value,
        consultant: document.getElementById("consultant").value,
        disbursedAmount: document.getElementById("disbursedAmount").value,
        progress: document.getElementById("progress").value,
        completionDate: document.getElementById("completionDate").value,
        receptionDate: document.getElementById("receptionDate").value,
      };

      try {
        const response = await fetch(
          `http://localhost:4000/activity/${activityCode}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          }
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.data || "فشل تحديث المشروع");

        alert("تم حفظ التعديلات بنجاح!");
        window.location.href = "index.html"; // العودة للرئيسية بعد النجاح
      } catch (error) {
        alert(`خطأ: ${error.message}`);
      } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = "حفظ التعديلات";
      }
    });
  }

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
      populateForm(result.data); // ملء النموذج بالبيانات
      attachSubmitListener(activityCode); // ربط وظيفة الحفظ بعد التأكد من وجود النموذج
    } catch (error) {
      formContainer.innerHTML = `<div class="alert alert-danger">فشل في جلب بيانات المشروع: ${error.message}</div>`;
    }
  }

  initializePage();
});
