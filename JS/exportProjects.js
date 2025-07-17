document.getElementById("export-excel-btn").addEventListener("click", () => {
  const projectName = document.getElementById("projectNameFilter").value.trim();
  const activityCode = document
    .getElementById("activityCodeFilter")
    .value.trim();
  const governorate = document.getElementById("governorateFilter").value;
  const fundingType = document.getElementById("fundingTypeFilter").value;
  const status = document.getElementById("statusFilter").value;

  const queryParams = [];

  if (projectName)
    queryParams.push(`activityName=${encodeURIComponent(projectName)}`);
  if (activityCode)
    queryParams.push(`activityCode=${encodeURIComponent(activityCode)}`);
  if (governorate && governorate !== "الكل")
    queryParams.push(`governorate=${encodeURIComponent(governorate)}`);
  if (fundingType && fundingType !== "الكل")
    queryParams.push(`fundingType=${encodeURIComponent(fundingType)}`);
  if (status && status !== "الكل")
    queryParams.push(`status=${encodeURIComponent(status)}`);

  const queryString = queryParams.join("&");
  const url = `http://localhost:4000/activity/export-excel${
    queryString ? `?${queryString}` : ""
  }`;

  console.log("Exporting from:", url);
  window.location.href = url;
});
