document.addEventListener("DOMContentLoaded", () => {

  if (!document.getElementById("chart1-container")) return;

  const API_ENDPOINTS = {
    dashboardData: "/api/dashboard",
  };

  function mockApiFetch(endpoint) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = {
          charts: {
            status: {
              labels: ["قيد التنفيذ", "مكتمل", "متأخر"],
              values: [15, 9, 4],
            },
            governorates: {
              labels: ["الشرقية", "دمياط", "السويس", "بورسعيد"],
              values: [8, 5, 6, 4],
            },
          },
          projects: [
            {
              id: 1,
              name: "تطوير وتوسعة طريق العريش",
              category: "طرق",
              progress: 75,
            },
            {
              id: 2,
              name: "إنشاء 500 وحدة إسكان",
              category: "اسكان اجتماعي",
              progress: 30,
            },
            {
              id: 3,
              name: "تأهيل محطة مياه دمياط",
              category: "مياه",
              progress: 95,
            },
          ],
        };
        resolve(data);
      }, 1500);
    });
  }

  function renderCharts(chartData) {
    const chart1Container = document.getElementById("chart1-container");
    chart1Container.innerHTML = '<canvas id="projectStatusChart"></canvas>';
    const ctx1 = chart1Container.querySelector("canvas").getContext("2d");
    new Chart(ctx1, {
      type: "doughnut",
      data: {
        labels: chartData.status.labels,
        datasets: [
          {
            data: chartData.status.values,
            backgroundColor: ["#0d6efd", "#198754", "#dc3545"],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    const chart2Container = document.getElementById("chart2-container");
    chart2Container.innerHTML =
      '<canvas id="projectsByGovernorateChart"></canvas>';
    const ctx2 = chart2Container.querySelector("canvas").getContext("2d");
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: chartData.governorates.labels,
        datasets: [
          {
            label: "عدد المشروعات",
            data: chartData.governorates.values,
            backgroundColor: "#0d6efd",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  function renderTable(projects) {
    const tableBody = document.getElementById("projects-table-body");
    tableBody.innerHTML = "";
    projects.forEach((project) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${project.name}</td>
                <td><span class="badge bg-secondary bg-opacity-10 text-secondary-emphasis">${project.category}</span></td>
                <td><div class="progress" style="height: 10px;"><div class="progress-bar" style="width: ${project.progress}%;"></div></div></td>
                <td>
                    <a href="project-details.html?id=${project.id}" class="action-btn" title="عرض التفاصيل"><i class="fas fa-eye text-info"></i></a>
                    <button class="action-btn" title="تعديل"><i class="fas fa-pen text-primary"></i></button>
                    <button class="action-btn" title="حذف" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal"><i class="fas fa-trash text-danger"></i></button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  }

  async function initializeDashboard() {
    try {
      const dashboardData = await mockApiFetch(API_ENDPOINTS.dashboardData);
      renderCharts(dashboardData.charts);
      renderTable(dashboardData.projects);
    } catch (error) {
      console.error("فشل تحميل بيانات لوحة التحكم:", error);
    }
  }

  initializeDashboard();
});
