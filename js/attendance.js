document.addEventListener("DOMContentLoaded", function () {

    const attendanceForm = document.getElementById("attendanceForm");
    const attendanceDate = document.getElementById("attendanceDate");
    const attendanceTableBody = document.getElementById("attendanceTableBody");

    function setTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        attendanceDate.value = `${year}-${month}-${day}`;
    }

    setTodayDate();

    if (!attendanceForm || !attendanceTableBody) {
        return;
    }

    attendanceForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const employee = document.getElementById("employee").value;
        const date = attendanceDate.value;
        const status = document.getElementById("status").value;

        if (!employee || !date || !status) {
            alert("Please fill all attendance details.");
            return;
        }

        const employeeDetails = employee.split("|");
        const employeeId = employeeDetails[0];
        const employeeName = employeeDetails[1];

        let statusClass = "";

        if (status === "Present") {
            statusClass = "status-present";
        } else if (status === "Absent") {
            statusClass = "status-absent";
        } else if (status === "Leave") {
            statusClass = "status-leave";
        }

        const emptyRow = attendanceTableBody.querySelector(".attendance-empty");

        if (emptyRow) {
            emptyRow.parentElement.remove();
        }

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        const idBadge = document.createElement("span");
        idBadge.className = "attendance-id";
        idBadge.textContent = employeeId;
        idCell.appendChild(idBadge);

        const nameCell = document.createElement("td");
        nameCell.textContent = employeeName;

        const dateCell = document.createElement("td");
        dateCell.textContent = date;

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");
        statusBadge.className = `attendance-status ${statusClass}`;
        statusBadge.textContent = status;
        statusCell.appendChild(statusBadge);

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(dateCell);
        row.appendChild(statusCell);

        attendanceTableBody.insertBefore(row, attendanceTableBody.firstChild);

        alert("Attendance recorded successfully!");

        attendanceForm.reset();
        setTodayDate();
    });

});
