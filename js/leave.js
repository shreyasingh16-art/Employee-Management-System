document.addEventListener("DOMContentLoaded", function () {

    const leaveForm = document.getElementById("leaveForm");
    const leaveTableBody = document.getElementById("leaveTableBody");
    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");

    if (!leaveForm || !leaveTableBody) {
        return;
    }

    const employees = {
        "EMP001": "Rishabh Sharma",
        "EMP002": "Priya Yadav",
        "EMP003": "Shreya Singh"
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayDate = `${year}-${month}-${day}`;

    fromDate.min = todayDate;
    toDate.min = todayDate;

    fromDate.addEventListener("change", function () {

        toDate.min = fromDate.value || todayDate;

        if (toDate.value && toDate.value < fromDate.value) {
            toDate.value = fromDate.value;
        }
    });

    leaveForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const employee = document.getElementById("leaveEmployee").value;
        const leaveType = document.getElementById("leaveType").value;
        const from = fromDate.value;
        const to = toDate.value;
        const reason = document.getElementById("leaveReason").value.trim();

        if (!employee || !leaveType || !from || !to || !reason) {
            alert("Please fill all leave details.");
            return;
        }

        if (from < todayDate) {
            alert("From Date cannot be in the past.");
            return;
        }

        if (to < from) {
            alert("To Date cannot be earlier than From Date.");
            return;
        }

        const employeeName = employees[employee];

        const emptyRow = leaveTableBody.querySelector(".leave-empty");

        if (emptyRow) {
            emptyRow.parentElement.remove();
        }

        const row = document.createElement("tr");

        const values = [
            employee,
            employeeName,
            leaveType,
            from,
            to,
            reason
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className = "leave-status status-pending";
        statusBadge.textContent = "Pending";

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        leaveTableBody.insertBefore(row, leaveTableBody.firstChild);

        alert("Leave request submitted successfully!");

        leaveForm.reset();

        fromDate.min = todayDate;
        toDate.min = todayDate;
    });

});
