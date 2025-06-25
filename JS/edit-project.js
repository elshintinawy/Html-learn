document.addEventListener("DOMContentLoaded", () => {
  const pageTitle = document.getElementById("page-title");
  const formContainer = document.getElementById("form-container");
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("loggedInUserToken");

  console.log("الصلاحية المحفوظة في المتصفح هي:", userRole);
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
    ],
    financial: [
      "estimatedValue",
      "contractualValue",
      "disbursedAmount",
      "undisbursedAmount",
    ],
    employee: [],
  };
  const allowedFields = permissions[userRole] || [];

  function getProjectCodeFromUrl() {
    return new URLSearchParams(window.location.search).get("code");
  }

  function renderForm(project) {
    formContainer.innerHTML = `
            <form id="editProjectForm">
                <div class="row g-3">
                    <h5 class="form-section-title">بيانات المشروع</h5>
                    <div class="col-md-6">
                        <label for="activityName" class="form-label">اسم المشروع</label>
                        <input type="text" id="activityName" class="form-control" value="${
                          project.activityName || ""
                        }">
                    </div>
                    <div class="col-md-6">
                        <label for="executingCompany" class="form-label">الشركة المنفذة</label>
                        <input type="text" id="executingCompany" class="form-control" value="${
                          project.executingCompany || ""
                        }">
                    </div>
                    <div class="col-md-6">
                        <label for="consultant" class="form-label">الاستشاري</label>
                        <input type="text" id="consultant" class="form-control" value="${
                          project.consultant || ""
                        }">
                    </div>
                    <div class="col-md-6">
                        <label for="disbursedAmount" class="form-label">المنصرف</label>
                        <input type="number" id="disbursedAmount" class="form-control" value="${
                          project.disbursedAmount || 0
                        }">
                    </div>
                    <div class="col-md-4">
                        <label for="progress" class="form-label">نسبة الإنجاز</label>
                        <input type="number" id="progress" class="form-control" value="${
                          project.progress || 0
                        }">
                    </div>
                    <div class="col-md-4">
                        <label for="completionDate" class="form-label">تاريخ النهو</label>
                        <input type="date" id="completionDate" class="form-control" value="${
                          project.completionDate
                            ? new Date(project.completionDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }">
                    </div>
                    <div class="col-md-4">
                        <label for="receptionDate" class="form-label">تاريخ الاستلام</label>
                        <input type="date" id="receptionDate" class="form-control" value="${
                          project.receptionDate
                            ? new Date(project.receptionDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }">
                    </div>
                    <div class="col-12 mt-4 text-center">
                        <button type="submit" class="btn btn-primary px-4" id="save-changes-button">حفظ التعديلات</button>
                    </div>
                </div>
            </form>
        `;

    // *** هنا يتم تطبيق الصلاحيات ***
    // المرور على كل الحقول في النموذج
    const allInputs = formContainer.querySelectorAll("input, select");
    allInputs.forEach((input) => {
      // إذا لم يكن الحقل ضمن قائمة الحقول المسموحة، قم بتعطيله
      if (!allowedFields.includes(input.id)) {
        input.disabled = true;
      }
    });

    attachSubmitListener(project.activityCode);
  }

  function attachSubmitListener(activityCode) {
    // ... نفس كود الحفظ كما هو ...
  }

  async function initializePage() {
    // ... نفس كود جلب البيانات كما هو ...
    const activityCode = getProjectCodeFromUrl();
    if (!activityCode) return;
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
      formContainer.innerHTML = `<div class="alert alert-danger">فشل جلب البيانات: ${error.message}</div>`;
    }
  }

  initializePage();
});
