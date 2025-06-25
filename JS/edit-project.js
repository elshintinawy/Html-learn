document.addEventListener("DOMContentLoaded", () => {
  // التأكد من أننا في الصفحة الصحيحة
  const pageTitle = document.getElementById("page-title");
  if (!pageTitle) return;

  const formContainer = document.getElementById("form-container");
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("loggedInUserToken");

  // ### بداية التصحيح 1: إعادة المفاتيح للغة العربية لتتطابق مع الباك اند ###
  const permissions = {
    ادمن: [
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
    "انشاء وتخطيط": [
      "activityName",
      "executingCompany",
      "consultant",
      "assignmentDate",
      "completionDate",
      "receptionDate",
      "executionStatus",
      "progress",
    ],
    مالي: ["estimatedValue", "contractualValue", "disbursedAmount"],
    مستخدم: [],
  };
  // ### نهاية التصحيح 1 ###

  const allowedFields = permissions[userRole] || [];

  function getProjectCodeFromUrl() {
    return new URLSearchParams(window.location.search).get("code");
  }

  function renderForm(project) {
    // ### بداية التصحيح 2: تعديل ترتيب الحقول ###
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
                    <div class="col-md-6"><label for="progress" class="form-label">نسبة الإنجاز</label><input type="number" id="progress" class="form-control" value="${
                      project.progress || 0
                    }"></div>

                    <h5 class="form-section-title">البيانات المالية</h5>
                    <div class="col-md-4"><label for="contractualValue" class="form-label">القيمة التعاقدية</label><input type="number" id="contractualValue" class="form-control" value="${
                      project.contractualValue || 0
                    }"></div>
                    <div class="col-md-4"><label for="estimatedValue" class="form-label">القيمة التقديرية</label><input type="number" id="estimatedValue" class="form-control" value="${
                      project.estimatedValue || 0
                    }"></div>
                    <div class="col-md-4"><label for="disbursedAmount" class="form-label">المنصرف</label><input type="number" id="disbursedAmount" class="form-control" value="${
                      project.disbursedAmount || 0
                    }"></div>

                    <h5 class="form-section-title">التواريخ</h5>
                    <div class="col-md-4"><label for="assignmentDate" class="form-label">تاريخ الاسناد</label><input type="date" id="assignmentDate" class="form-control" value="${
                      project.assignmentDate
                        ? new Date(project.assignmentDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
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
                    
                    <div class="col-12 mt-4 text-center"><button type="submit" class="btn btn-primary px-4" id="save-changes-button">حفظ التعديلات</button></div>
                </div>
            </form>
        `;
    // ### نهاية التصحيح 2 ###

    // تطبيق الصلاحيات: تعطيل الحقول غير المسموح بها
    const allInputs = formContainer.querySelectorAll("input, select");
    allInputs.forEach((input) => {
      if (input.id && !allowedFields.includes(input.id)) {
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
      const updatedData = {};
      allowedFields.forEach((fieldId) => {
        const input = document.getElementById(fieldId);
        if (input && !input.disabled) {
          updatedData[fieldId] = input.value;
        }
      });
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
        window.location.href = "index.html";
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
      renderForm(result.data);
    } catch (error) {
      formContainer.innerHTML = `<div class="alert alert-danger">فشل في جلب بيانات المشروع: ${error.message}</div>`;
    }
  }

  initializePage();
});
