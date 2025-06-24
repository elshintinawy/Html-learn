document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("projects-table-body")) {
    return;
  }

  const projectsTableBody = document.getElementById("projects-table-body");
  const chart1Container = document.getElementById("chart1-container");
  const chart2Container = document.getElementById("chart2-container");
  const PROJECTS_API_URL = "http://localhost:4000/activity/";

  function renderCharts() {
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
      projectsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">لا توجد مشاريع لعرضها حاليًا.</td></tr>`;
      return;
    }

    const latestFiveProjects = projects.slice(-5).reverse();

    latestFiveProjects.forEach((project) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${project.name || "مشروع بدون اسم"}</td>
                <td><span class="badge bg-secondary bg-opacity-10 text-secondary-emphasis">${
                  project.category || "غير محدد"
                }</span></td>
                <td><div class="progress" style="height: 10px;"><div class="progress-bar" style="width: ${
                  project.progress || 0
                }%;"></div></div></td>
                <td>
                    <a href="project-details.html?id=${
                      project.id
                    }" class="action-btn" title="عرض التفاصيل"><i class="fas fa-eye text-info"></i></a>
                    <button class="action-btn" title="تعديل"><i class="fas fa-pen text-primary"></i></button>
                    <button class="action-btn" title="حذف" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal"><i class="fas fa-trash text-danger"></i></button>
                </td>
            `;
      projectsTableBody.appendChild(row);
    });
  }

  function displayError(message) {
    projectsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">${message}</td></tr>`;
    chart1Container.innerHTML = `<div class="text-danger">${message}</div>`;
    chart2Container.innerHTML = "";
  }

  async function initializeDashboard() {
    const token = localStorage.getItem("loggedInUserToken");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(PROJECTS_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `خطأ من السيرفر: ${response.status}`
        );
      }

      const apiResponse = await response.json();

      const projects = apiResponse.data;

      renderTable(projects);
      renderCharts();
    } catch (error) {
      console.error("فشل تحميل بيانات لوحة التحكم:", error);
      displayError(
        "فشل الاتصال بالسيرفر. الرجاء التأكد من أن الواجهة الخلفية تعمل."
      );
    }
  }

  initializeDashboard();
});
