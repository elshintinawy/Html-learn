document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  const errorMessageDiv = document.getElementById("error-message");
  const loginButton = document.getElementById("login-button");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    loginButton.disabled = true;
    loginButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> جاري الدخول...`;
    errorMessageDiv.classList.add("d-none");

    const nationalId = document.getElementById("nationalId").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nationalId, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || result.data || "حدث خطأ غير متوقع");
      }

      const employeeData = result.data;

      // ### بداية: هذا هو الجزء الذي تم تصحيحه ###
      // الآن نقوم بحفظ التوكن، الاسم، والصلاحية
      localStorage.setItem("loggedInUserToken", employeeData.token);
      localStorage.setItem("loggedInUser", employeeData.name);
      localStorage.setItem("userRole", employeeData.role); // <-- هذا هو السطر الجديد والمهم
      // ### نهاية: الجزء الذي تم تصحيحه ###

      window.location.href = "dashboard.html";
    } catch (error) {
      errorMessageDiv.textContent = error.message;
      errorMessageDiv.classList.remove("d-none");
      loginButton.disabled = false;
      loginButton.innerHTML = "تسجيل الدخول";
    }
  });
});
