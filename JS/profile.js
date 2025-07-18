document.addEventListener("DOMContentLoaded", () => {
  const changePasswordForm = document.getElementById("changePasswordForm");
  if (!changePasswordForm) {
    return;
  }

  const token = localStorage.getItem("loggedInUserToken");
  const profileName = document.getElementById("profile-name");
  const profileRole = document.getElementById("profile-role");
  const profileEmail = document.getElementById("profile-email");
  const profileCreatedAt = document.getElementById("profile-createdAt");
  const savePasswordBtn = document.getElementById("save-password-btn");

  const roleTranslations = {
    admin: "ادمن",
    manager: "انشاء وتخطيط",
    financial: "مالي",
    employee: "موظف",
  };

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
      const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
      toast.show();
    }
  }

  async function loadProfile() {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.data || "فشل جلب بيانات الملف الشخصي");
      }

      const user = result.data;
      profileName.textContent = user.name || "غير محدد";
      profileEmail.textContent = user.email || "غير متوفر";
      profileRole.textContent = roleTranslations[user.role] || user.role;

      profileCreatedAt.textContent = new Date(
        user.createdAt
      ).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      profileName.textContent = "خطأ في تحميل البيانات";
    }
  }

  changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    savePasswordBtn.disabled = true;
    savePasswordBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> جاري الحفظ...';

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      showToast("كلمة المرور الجديدة وتأكيدها غير متطابقين.", "danger");
      savePasswordBtn.disabled = false;
      savePasswordBtn.innerHTML = "حفظ التغييرات";
      return;
    }

    const requestBody = {
      OldPassword: currentPassword,
      NewPassword: newPassword,
      ConfirmPassword: confirmPassword,
    };

    try {
      const response = await fetch(`${API_URL}auth/changePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          OldPassword: currentPassword,
          NewPassword: newPassword,
          ConfirmPassword: confirmPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.data || result.message || "فشل تغيير كلمة المرور"
        );
      }

      showToast(
        "تم تغيير كلمة المرور بنجاح! سيتم تسجيل خروجك الآن.",
        "success"
      );

      setTimeout(() => {
        localStorage.clear();
        window.location.href = "login.html";
      }, 2000);
    } catch (error) {
      showToast(`خطأ: ${error.message}`, "danger");
      savePasswordBtn.disabled = false;
      savePasswordBtn.innerHTML = "حفظ التغييرات";
    }
  });

  loadProfile();
});
