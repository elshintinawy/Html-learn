document.addEventListener("DOMContentLoaded", () => {
  // التأكد من أننا في الصفحة الصحيحة (لوحة التحكم)
  if (!document.getElementById("chart1-container")) {
    return;
  }

  // --- 1. تعريف العناصر وعناوين API ---
  const projectsTableBody = document.getElementById("projects-table-body");
  const chart1Container = document.getElementById("chart1-container");
  const chart2Container = document.getElementById("chart2-container");
  const API_URL = "http://localhost:4000/activity/";

  // --- 2. دوال مساعدة ودوال تحديث الواجهة ---

  function getProgressBarColor(percentage, status) {
    if (status === "متأخر") {
      return "#dc3545"; // Bootstrap Danger Red
    }
    const red = { r: 220, g: 53, b: 69 };
    const blue = { r: 13, g: 110, b: 253 };
    const green = { r: 25, g: 135, b: 84 };

    const interpolateColor = (color1, color2, factor) => {
      const r = Math.round(color1.r + factor * (color2.r - color1.r));
      const g = Math.round(color1.g + factor * (color2.g - color1.g));
      const b = Math.round(color1.b + factor * (color2.b - color1.b));
      return `rgb(${r}, ${g}, ${b})`;
    };

    if (percentage >= 100) {
      return `rgb(${green.r}, ${green.g}, ${green.b})`;
    }
    if (percentage >= 50) {
      const factor = (percentage - 50) / 50;
      return interpolateColor(blue, green, factor);
    }
    const factor = percentage / 50;
    return interpolateColor(red, blue, factor);
  }

  function renderCharts() {
    // بيانات وهمية للرسوم البيانية
    const mockChartData = {
      status: { labels: ["قيد التنفيذ", "مكتمل", "متأخر"], values: [15, 9, 4] },
      governorates: {
        labels: ["الشرقية", "دمياط", "السويس", "بورسعيد"],
        values: [8, 5, 6, 4],
      },
    };

    chart1Container.innerHTML = '<canvas id="projectStatusChart"></canvas>';
    const ctx1 = chart1Container.querySelector("canvas").getContext("2d");
    new Chart(ctx1, {
      type: "doughnut",
      data: {
        labels: mockChartData.status.labels,
        datasets: [
          {
            data: mockChartData.status.values,
            backgroundColor: ["#0d6efd", "#198754", "#dc3545"],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    chart2Container.innerHTML =
      '<canvas id="projectsByGovernorateChart"></canvas>';
    const ctx2 = chart2Container.querySelector("canvas").getContext("2d");
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: mockChartData.governorates.labels,
        datasets: [
          {
            label: "عدد المشروعات",
            data: mockChartData.governorates.values,
            backgroundColor: "#0d6efd",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  function renderTable(projects) {
    projectsTableBody.innerHTML = "";
    if (!projects || projects.length === 0) {
      projectsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">لا توجد مشاريع لعرضها.</td></tr>`;
      return;
    }

    const latestFiveProjects = projects.slice(-5).reverse();

    latestFiveProjects.forEach((project) => {
      const row = document.createElement("tr");
      const percentage = project.progress || project.executionStatus || 0;
      const barColor = getProgressBarColor(percentage, project.status);

      // ### تم تحديث هذا الجزء لربط زر التعديل ###
      row.innerHTML = `
                <td>${project.activityName || "مشروع بدون اسم"}</td>
                <td><span class="badge bg-light text-dark fw-normal">${
                  project.projectCategory || "غير محدد"
                }</span></td>
                <td>
                    <div class="progress" role="progressbar" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100" style="height: 20px; font-size: 0.8rem;">
                        <div class="progress-bar fw-bold" style="width: ${percentage}%; background-color: ${barColor};">
                            ${percentage}%
                        </div>
                    </div>
                </td>
                <td>
                    <a href="project-details.html?code=${
                      project.activityCode
                    }" class="action-btn" title="عرض التفاصيل"><i class="fas fa-eye text-info"></i></a>
                    <a href="edit-project.html?code=${
                      project.activityCode
                    }" class="action-btn" title="تعديل"><i class="fas fa-pen text-primary"></i></a>
                    <button class="action-btn delete-btn" data-code="${
                      project.activityCode
                    }" title="حذف" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal"><i class="fas fa-trash text-danger"></i></button>
                </td>
            `;

      projectsTableBody.appendChild(row);
    });
  }

  function displayError(message) {
    projectsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger p-4">${message}</td></tr>`;
    chart1Container.innerHTML = `<div class="text-danger p-4 text-center d-flex align-items-center justify-content-center h-100">${message}</div>`;
    chart2Container.innerHTML = "";
  }

  async function initializeDashboard() {
    try {
      const token = localStorage.getItem("loggedInUserToken");

      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiResponse = await response.json();
      if (!response.ok) {
        throw new Error(
          apiResponse.data || apiResponse.message || "فشل جلب البيانات"
        );
      }

      if (
        apiResponse &&
        apiResponse.data &&
        Array.isArray(apiResponse.data.activities)
      ) {
        renderTable(apiResponse.data.activities);
        renderCharts();
      } else {
        throw new Error("شكل البيانات المستلمة من السيرفر غير متوقع.");
      }
    } catch (error) {
      console.error("فشل تحميل لوحة التحكم:", error);
      displayError(error.message);
    }
  }

  initializeDashboard();
});
