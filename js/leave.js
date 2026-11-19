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

    let employees = [];
    let leaves = [];

    function getTodayDate() {
        const today = new Date();

        return [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");
    }

    const todayDate = getTodayDate();

    function loadEmployees() {
        leaveEmployee.innerHTML = "";

        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.textContent = employees.length === 0
            ? "No employees available"
            : "Select Employee";

        leaveEmployee.appendChild(firstOption);

        employees.forEach(function (employee) {
            const option = document.createElement("option");
            option.value = employee.id;
            option.textContent = `${employee.id} - ${employee.name}`;
            leaveEmployee.appendChild(option);
        });
    }

    function renderLeaves() {
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

    async function initializeLeaves() {
        try {
            const [employeeData, leaveData] = await Promise.all([
                getEmployees(),
                getLeaves()
            ]);

            employees = employeeData;
            leaves = leaveData;

            loadEmployees();
            renderLeaves();
        } catch (error) {
            console.error("Leave loading error:", error);
            alert("Unable to load leave data. Please check that the backend is running.");
        }
    }

    fromDate.min = todayDate;
    toDate.min = todayDate;

    fromDate.addEventListener("change", function () {
        toDate.min = fromDate.value || todayDate;

        if (toDate.value && toDate.value < fromDate.value) {
            toDate.value = fromDate.value;
        }
    });

    leaveForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const employeeId = leaveEmployee.value;
        const selectedEmployee = employees.find(function (employee) {
            return String(employee.id) === String(employeeId);
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

        const newLeave = {
            employeeId: Number(employeeId),
            leaveType: type,
            fromDate: from,
            toDate: to,
            reason: reason
        };

        try {
            const savedLeave = await addLeave(newLeave);

            leaves.unshift(savedLeave);
            renderLeaves();

            alert("Leave request submitted successfully!");

            leaveForm.reset();
            fromDate.min = todayDate;
            toDate.min = todayDate;
        } catch (error) {
            console.error("Leave submission error:", error);
            alert(error.message || "Unable to submit leave request.");
        }
    });

    initializeLeaves();
});
