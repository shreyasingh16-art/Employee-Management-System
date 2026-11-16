document.addEventListener("DOMContentLoaded", function () {
    const leaveForm = document.getElementById("leaveForm");
    const leaveTableBody = document.getElementById("leaveTableBody");
    const leaveEmployee = document.getElementById("leaveEmployee");
    const leaveType = document.getElementById("leaveType");
    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");
    const leaveReason = document.getElementById("leaveReason");

    if (!leaveForm || !leaveTableBody || !leaveEmployee) {
        return;
    }

    const EMPLOYEE_KEY = "emplyraEmployees";
    const LEAVE_KEY = "emplyraLeaves";

    function getData(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    function saveLeaves(leaves) {
        localStorage.setItem(LEAVE_KEY, JSON.stringify(leaves));
    }

    function loadEmployees() {
        const employees = getData(EMPLOYEE_KEY);
        const selectedValue = leaveEmployee.value;

        leaveEmployee.innerHTML = '<option value="">Select Employee</option>';

        employees.forEach(function (employee) {
            const option = document.createElement("option");
            option.value = employee.id;
            option.textContent = `${employee.id} - ${employee.name}`;
            leaveEmployee.appendChild(option);
        });

        if (employees.some(employee => employee.id === selectedValue)) {
            leaveEmployee.value = selectedValue;
        }

        if (employees.length === 0) {
            leaveEmployee.innerHTML = '<option value="">No employees available</option>';
        }
    }

    function loadInitialLeaves() {
        if (localStorage.getItem(LEAVE_KEY) !== null) {
            return;
        }

        const initialLeaves = [];

        leaveTableBody.querySelectorAll("tr").forEach(function (row) {
            const cells = row.querySelectorAll("td");

            if (cells.length < 7) {
                return;
            }

            initialLeaves.push({
                id: Date.now().toString() + Math.random().toString(16).slice(2),
                employeeId: cells[0].textContent.trim(),
                employeeName: cells[1].textContent.trim(),
                leaveType: cells[2].textContent.trim(),
                fromDate: cells[3].textContent.trim(),
                toDate: cells[4].textContent.trim(),
                reason: cells[5].textContent.trim(),
                status: cells[6].textContent.trim()
            });
        });

        saveLeaves(initialLeaves);
    }

    function renderLeaves() {
        const leaves = getData(LEAVE_KEY);
        leaveTableBody.innerHTML = "";

        if (leaves.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 7;
            cell.className = "leave-empty";
            cell.textContent = "No leave requests found.";

            row.appendChild(cell);
            leaveTableBody.appendChild(row);
            return;
        }

        leaves.forEach(function (leave) {
            const row = document.createElement("tr");

            const values = [
                leave.employeeId,
                leave.employeeName,
                leave.leaveType,
                leave.fromDate,
                leave.toDate,
                leave.reason
            ];

            values.forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            statusBadge.className = "leave-status";

            if (leave.status === "Approved") {
                statusBadge.classList.add("status-approved");
            } else if (leave.status === "Rejected") {
                statusBadge.classList.add("status-rejected");
            } else {
                statusBadge.classList.add("status-pending");
            }

            statusBadge.textContent = leave.status;
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);

            leaveTableBody.appendChild(row);
        });
    }

    const today = new Date();
    const todayDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

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

        const employeeId = leaveEmployee.value;
        const selectedEmployee = getData(EMPLOYEE_KEY).find(function (employee) {
            return employee.id === employeeId;
        });

        const type = leaveType.value;
        const from = fromDate.value;
        const to = toDate.value;
        const reason = leaveReason.value.trim();

        if (!selectedEmployee) {
            alert("Please select a valid employee.");
            return;
        }

        if (!type || !from || !to || !reason) {
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

        const leaves = getData(LEAVE_KEY);

        const newLeave = {
            id: Date.now().toString(),
            employeeId: selectedEmployee.id,
            employeeName: selectedEmployee.name,
            leaveType: type,
            fromDate: from,
            toDate: to,
            reason: reason,
            status: "Pending"
        };

        leaves.unshift(newLeave);
        saveLeaves(leaves);
        renderLeaves();

        alert("Leave request submitted successfully!");

        leaveForm.reset();
        fromDate.min = todayDate;
        toDate.min = todayDate;
    });

    loadInitialLeaves();
    loadEmployees();
    renderLeaves();
});
