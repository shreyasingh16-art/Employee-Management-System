if (!sessionStorage.getItem("loggedInUser")) {
    sessionStorage.setItem("redirectAfterLogin", "attendance.html");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();

            sessionStorage.removeItem("loggedInUser");
            sessionStorage.removeItem("userRole");
            sessionStorage.removeItem("redirectAfterLogin");

            window.location.href = "login.html";
        });
    }

    const attendanceForm = document.getElementById("attendanceForm");
    const employeeSelect = document.getElementById("employee");
    const attendanceDate = document.getElementById("attendanceDate");
    const statusSelect = document.getElementById("status");
    const attendanceTableBody = document.getElementById("attendanceTableBody");

    if (!attendanceForm || !employeeSelect || !attendanceDate || !statusSelect || !attendanceTableBody) {
        return;
    }

    let employees = [];
    let attendanceRecords = [];

    function setTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        attendanceDate.value = `${year}-${month}-${day}`;
    }

    function loadEmployees() {
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

    async function initializeAttendance() {
        try {
            const [employeeData, attendanceData] = await Promise.all([
                getEmployees(),
                getAttendance()
            ]);

            employees = employeeData;
            attendanceRecords = attendanceData;

            loadEmployees();
            renderAttendance();
        } catch (error) {
            console.error("Attendance loading error:", error);
            alert("Unable to load attendance data. Please check that the backend is running.");
        }
    }

    attendanceForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const employeeId = employeeSelect.value;
        const date = attendanceDate.value;
        const status = statusSelect.value;

        if (!employeeId || !date || !status) {
            alert("Please fill all attendance details.");
            return;
        }

        const employee = employees.find(function (item) {
            return String(item.id) === String(employeeId);
        });

        if (!employee) {
            alert("Selected employee was not found. Please refresh the page.");
            return;
        }

        const duplicate = attendanceRecords.some(function (record) {
            return String(record.employeeId) === String(employeeId) && record.date === date;
        });

        if (duplicate) {
            alert("Attendance for this employee and date has already been recorded.");
            return;
        }

        const newRecord = {
            employeeId: Number(employeeId),
            date: date,
            status: status
        };

        try {
            const savedRecord = await addAttendance(newRecord);

            attendanceRecords.unshift(savedRecord);
            renderAttendance();

            alert("Attendance recorded successfully!");

            attendanceForm.reset();
            setTodayDate();
        } catch (error) {
            console.error("Attendance save error:", error);
            alert(error.message || "Unable to save attendance. Please try again.");
        }
    });

    setTodayDate();
    initializeAttendance();
});
