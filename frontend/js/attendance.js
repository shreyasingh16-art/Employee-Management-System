document.getElementById("attendanceForm").addEventListener("submit", function (event) {

    event.preventDefault();

    const employee = document.getElementById("employee");
    const date = document.getElementById("attendanceDate").value;
    const status = document.getElementById("status").value;

    const employeeText =
        employee.options[employee.selectedIndex].text;

    const employeeData = employeeText.split(" - ");

    const employeeId = employeeData[0];
    const employeeName = employeeData[1];

    const tableBody =
        document.getElementById("attendanceTableBody");

    let statusClass = "";

    if (status === "Present") {
        statusClass = "present";
    } else if (status === "Absent") {
        statusClass = "absent";
    } else {
        statusClass = "leave";
    }

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${employeeId}</td>
        <td>${employeeName}</td>
        <td>${date}</td>
        <td>
            <span class="status ${statusClass}">
                ${status}
            </span>
        </td>
    `;

    tableBody.appendChild(row);

    alert("Attendance marked successfully!");

    document.getElementById("attendanceForm").reset();

});