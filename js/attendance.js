
document.addEventListener("DOMContentLoaded", function () {
    const attendanceForm = document.getElementById("attendanceForm");
    const employeeSelect = document.getElementById("employee");
    const attendanceDate = document.getElementById("attendanceDate");
    const statusSelect = document.getElementById("status");
    const attendanceTableBody = document.getElementById("attendanceTableBody");

    if (!attendanceForm || !employeeSelect || !attendanceDate || !statusSelect || !attendanceTableBody) {
        return;
    }

    function getData(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            alert("Unable to save data in browser storage.");
            return false;
        }
    }

    let attendanceRecords = getData("emplyraAttendance");
    const employees = getData("emplyraEmployees");

    function setTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        attendanceDate.value = `${year}-${month}-${day}`;
    }

    function loadEmployees() {
        const selectedValue = employeeSelect.value;
        employeeSelect.innerHTML = "";

        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.textContent = "Select Employee";
        employeeSelect.appendChild(firstOption);

        employees.forEach(function (employee) {
            const option = document.createElement("option");
            option.value = employee.id;
            option.textContent = `${employee.id} - ${employee.name}`;
            employeeSelect.appendChild(option);
        });

        employeeSelect.value = selectedValue;
    }

    function getStatusClass(status) {
        if (status === "Present") return "status-present";
        if (status === "Absent") return "status-absent";
        if (status === "Leave") return "status-leave";
        return "";
    }

    function renderAttendance() {
        attendanceTableBody.innerHTML = "";

        if (attendanceRecords.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 4;
            cell.className = "attendance-empty";
            cell.textContent = "No attendance records found.";
            row.appendChild(cell);
            attendanceTableBody.appendChild(row);
            return;
        }

        attendanceRecords.forEach(function (record) {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            const idBadge = document.createElement("span");
            idBadge.className = "attendance-id";
            idBadge.textContent = record.employeeId;
            idCell.appendChild(idBadge);

            const nameCell = document.createElement("td");
            nameCell.textContent = record.employeeName;

            const dateCell = document.createElement("td");
            dateCell.textContent = record.date;

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");
            statusBadge.className = `attendance-status ${getStatusClass(record.status)}`;
            statusBadge.textContent = record.status;
            statusCell.appendChild(statusBadge);

            row.append(idCell, nameCell, dateCell, statusCell);
            attendanceTableBody.appendChild(row);
        });
    }

    attendanceForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const employeeId = employeeSelect.value;
        const date = attendanceDate.value;
        const status = statusSelect.value;

        if (!employeeId || !date || !status) {
            alert("Please fill all attendance details.");
            return;
        }

        const employee = employees.find(item => item.id === employeeId);

        if (!employee) {
            alert("Selected employee was not found. Please refresh the page.");
            return;
        }

        const duplicate = attendanceRecords.some(function (record) {
            return record.employeeId === employeeId && record.date === date;
        });

        if (duplicate) {
            alert("Attendance for this employee and date has already been recorded.");
            return;
        }

        const newRecord = {
            employeeId: employee.id,
            employeeName: employee.name,
            date: date,
            status: status
        };

        attendanceRecords.unshift(newRecord);

        if (!saveData("emplyraAttendance", attendanceRecords)) {
            attendanceRecords.shift();
            return;
        }

        renderAttendance();
        alert("Attendance recorded successfully!");

        attendanceForm.reset();
        setTodayDate();
    });

    loadEmployees();
    setTodayDate();
    renderAttendance();
});
