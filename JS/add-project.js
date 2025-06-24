document.addEventListener("DOMContentLoaded", () => {

  const addProjectForm = document.getElementById("addProjectForm");
  if (!addProjectForm) return; 

  const saveButton = document.getElementById("save-project-button");
  const toastContainer = document.querySelector(".toast-container");
  const API_URL = "http://localhost:4000/activity/"; 


  function showToast(message, type = "success") {
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


  addProjectForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    saveButton.disabled = true;
    saveButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> جاري الحفظ...`;


    const formData = {
      activityCode: document.getElementById("activityCode").value,
      activityName: document.getElementById("activityName").value,
      executingCompany: document.getElementById("executingCompany").value,
      consultant: document.getElementById("consultant").value,
      governorate: document.getElementById("governorate").value,
      fundingType: document.getElementById("fundingType").value,
      projectCategory: document.getElementById("projectCategory").value,
      estimatedValue: document.getElementById("estimatedValue").value || 0,
      contractualValue: document.getElementById("contractualValue").value || 0,
      disbursedAmount: document.getElementById("disbursedAmount").value || 0,
      assignmentDate: document.getElementById("assignmentDate").value,
      completionDate: document.getElementById("completionDate").value,
      receptionDate: document.getElementById("receptionDate").value,
    };

    const token = localStorage.getItem("loggedInUserToken");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        
        throw new Error(result.data || "حدث خطأ أثناء حفظ المشروع.");
      }

      showToast("تمت إضافة المشروع بنجاح!", "success");
      addProjectForm.reset(); 
    } catch (error) {
      showToast(error.message, "danger");
    } finally {
      saveButton.disabled = false;
      saveButton.innerHTML = "حفظ المشروع";
    }
  });
});
