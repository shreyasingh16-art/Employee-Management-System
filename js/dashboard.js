if (!sessionStorage.getItem("loggedInUser")) {
    sessionStorage.setItem("redirectAfterLogin", "dashboard.html");
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

    const currentDate = document.getElementById("currentDate");

    const today = new Date();
    const todayDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    if (currentDate) {
        currentDate.textContent = today.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    function percentage(value, total) {
        return total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
    }

    function updateProgress(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.style.width = `${Math.min(value, 100)}%`;
        }
    }

    async function updateDashboard() {
        try {
            const [employees, attendance, leaves] = await Promise.all([
                getEmployees(),
                getAttendance(),
                getLeaves()
            ]);

            const totalEmployees = employees.length;
            const totalLeaveRequests = leaves.length;

            const todayAttendance = attendance.filter(function (record) {
                return record.date === todayDate;
            });

            const attendanceMap = new Map();

            todayAttendance.forEach(function (record) {
                attendanceMap.set(
                    String(record.employeeId),
                    String(record.status).toLowerCase()
                );
            });

            const onLeave = new Set();

            leaves.forEach(function (leave) {
                if (
                    String(leave.status).toLowerCase() === "approved" &&
                    leave.fromDate <= todayDate &&
                    leave.toDate >= todayDate
                ) {
                    onLeave.add(String(leave.employeeId));
                }
            });

            todayAttendance.forEach(function (record) {
                if (String(record.status).toLowerCase() === "leave") {
                    onLeave.add(String(record.employeeId));
                }
            });

            const present = employees.filter(function (employee) {
                return attendanceMap.get(String(employee.id)) === "present" &&
                    !onLeave.has(String(employee.id));
            }).length;

            const absent = employees.filter(function (employee) {
                return attendanceMap.get(String(employee.id)) === "absent" &&
                    !onLeave.has(String(employee.id));
            }).length;

            const leaveCount = onLeave.size;

            const presentPercent = percentage(present, totalEmployees);
            const absentPercent = percentage(absent, totalEmployees);
            const leavePercent = percentage(leaveCount, totalEmployees);

            setText("totalEmployee", totalEmployees);
            setText("presentEmployee", present);
            setText("absentEmployee", absent);
            setText("leaveEmployee", totalLeaveRequests);

            setText("presentPercentage", `${presentPercent}% attendance`);
            setText("absentPercentage", `${absentPercent}% of employees`);
            setText("leavePercentage", `${leaveCount} employees on leave today`);

            setText("attendancePresent", `${presentPercent}%`);
            setText("attendanceAbsent", `${absentPercent}%`);
            setText("attendanceLeave", `${leavePercent}%`);

            updateProgress("presentProgress", Number(presentPercent));
            updateProgress("absentProgress", Number(absentPercent));
            updateProgress("leaveProgress", Number(leavePercent));

            updateRecentEmployees(employees);

        } catch (error) {
            console.error("Dashboard loading error:", error);
            alert("Unable to load dashboard data. Please check that the backend is running.");
        }
    }

    function updateRecentEmployees(employees) {
        const tableBody = document.getElementById("recentEmployeesTable");

        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";

        const recentEmployees = [...employees]
            .sort(function (a, b) {
                return (b.joiningDate || "").localeCompare(a.joiningDate || "");
            })
            .slice(0, 5);

        if (recentEmployees.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 4;
            cell.textContent = "No employees found.";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        recentEmployees.forEach(function (employee) {
            const row = document.createElement("tr");

            const employeeCell = document.createElement("td");
            const employeeInfo = document.createElement("div");
            const avatar = document.createElement("div");
            const details = document.createElement("div");
            const name = document.createElement("strong");
            const employeeId = document.createElement("small");

            employeeInfo.className = "employee-info";
            avatar.className = "employee-avatar";

            avatar.textContent = employee.name
                .split(" ")
                .filter(Boolean)
                .map(part => part.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("");

            name.textContent = employee.name;
            employeeId.textContent = employee.id;

            details.appendChild(name);
            details.appendChild(employeeId);
            employeeInfo.appendChild(avatar);
            employeeInfo.appendChild(details);
            employeeCell.appendChild(employeeInfo);

            const departmentCell = document.createElement("td");
            departmentCell.textContent = employee.department || "-";

            const positionCell = document.createElement("td");
            positionCell.textContent = employee.position || "-";

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            statusBadge.className = "employee-status active-status";
            statusBadge.textContent = "Active";

            statusCell.appendChild(statusBadge);

            row.appendChild(employeeCell);
            row.appendChild(departmentCell);
            row.appendChild(positionCell);
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });
    }

    updateDashboard();
});
